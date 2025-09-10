import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { LockEnum } from './enum/lock.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbLockService implements OnModuleDestroy {
  private isJobsAllowedOnThisInstance = process.env.IS_JOBS_ALLOWED_ON_THIS_INSTANCE;
  private isLocal = process.env.NODE_ENV == 'LOCAL';
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.isJobsAllowedOnThisInstance && !this.isLocal && process.env.CLUSTER_WORKER_INSTANCE == '0';
  }

  private lockList: any[] = [];
  private backendLayerId = 200;

  async onModuleDestroy() {
    console.log('🔓 Releasing advisory locks on shutdown...');
    for (const lock of this.lockList) {
      await this.prisma.$executeRawUnsafe(`SELECT pg_advisory_unlock(${lock});`);
    }
  }

  async checkJOB(lockEnum: LockEnum) {
    const env = this.configService.get('appConfig.environment');
    if (env === 'LOCAL') {
      console.log('🔒 Advisory lock not acquired');
      return false;
    }
    // if (
    //   !this.isJobsAllowedOnThisInstance ||
    //   this.isLocal ||
    //   process.env.CLUSTER_WORKER_INSTANCE !== "0"
    // )
    //   return false;

    // only run on EC2 instance, not local and on primary cluster
    try {
      let isJobAllowed = true;
      let lockNumber = 1;
      let key = 'isPriceOracleRunning';

      switch (lockEnum) {
        case LockEnum.PRICE_ORACLE:
          lockNumber = 1;
          key = 'isPriceOracleRunning';
          break;
        case LockEnum.SWAP:
          lockNumber = 2;
          key = 'isSwapQueueRunning';
          break;
        case LockEnum.TRADE:
          lockNumber = 3;
          key = 'isTradeDepositQueueRunning';
          break;
        case LockEnum.P2P:
          lockNumber = 4;
          key = 'isP2PDepositQueueRunning';
          break;
        case LockEnum.WALLET:
          lockNumber = 5;
          key = 'isWalletWithdrawQueueRunning';
          break;
        case LockEnum.AUTH:
          lockNumber = 6;
          key = 'isAuthJobsRunning';
          break;
        case LockEnum.RAFFLE:
          lockNumber = 7;
          key = 'isRaffleJobsRunning';
          break;
        case LockEnum.NOTIFICATION:
          lockNumber = 8;
          key = 'isNotificationJobsRunning';
          break;
        case LockEnum.CARD:
          lockNumber = 9;
          key = 'isCardJobsRunning';
          break;
        case LockEnum.WALLET_EXCHANGE:
          lockNumber = 10;
          key = 'isWalletExchangeRunning';
          break;
        case LockEnum.RANDOM:
          lockNumber = 11;
          key = 'isWalletExchangeRunning';
          break;
      }
      const result: Array<{ pg_try_advisory_lock: boolean }> = await this.prisma.$queryRawUnsafe(
        `SELECT pg_try_advisory_lock(${this.backendLayerId + lockNumber});`,
      );
      if (result[0]?.pg_try_advisory_lock) {
        console.log('🔒 Advisory lock acquired');
        isJobAllowed = true;
      } else {
        isJobAllowed = false;
      }
      // await this.processFlagRepository.manager.transaction(
      //   async (transactionalEntityManager) => {
      //     // Acquire an advisory lock using a unique identifier
      //     // const lockAcquired = await transactionalEntityManager.query(
      //     //   `SELECT pg_advisory_lock(${lockNumber});`
      //     // );

      //     try {
      //       // Fetch the flag with pessimistic locking
      //       let processFlag = await transactionalEntityManager.findOne(
      //         ProcessFlag,
      //         {
      //           where: { [key]: false },
      //           lock: { mode: "pessimistic_write" },
      //         }
      //       );

      //       if (!processFlag) {
      //         isJobAllowed = false;
      //         throw new Error(
      //           lockEnum + " process is already running or not found."
      //         );
      //       }

      //       // Update the flag to true
      //       processFlag[key] = true;
      //       await transactionalEntityManager.save(processFlag);

      //       isJobAllowed = true;
      //     } catch (error) {
      //       isJobAllowed = false;
      //     } finally {
      //       await transactionalEntityManager.query(
      //         `SELECT pg_advisory_unlock(${lockNumber});`
      //       );
      //     }
      //   }
      // );

      //TODO: fix this logic
      const instanceId = process.env.CURRENT_INSTANCE_ID;

      // if (index === '0') {
      //   return true;
      // }
      console.log(
        `process ${instanceId} lockId ${this.backendLayerId + lockNumber} ${isJobAllowed}`,
      );

      //      if (lockEnum != LockEnum.RANDOM) return false;
      return isJobAllowed;
    } catch (error) {
      return false;
    }
  }

  async checkProcessWithId(id: number): Promise<boolean> {
    try {
      const lockNumber = this.backendLayerId + id; // You can also hash id if needed
      const result: Array<{ pg_try_advisory_lock: boolean }> = await this.prisma.$queryRawUnsafe(
        `SELECT pg_try_advisory_lock(${lockNumber});`,
      );

      const isJobAllowed = result[0]?.pg_try_advisory_lock === true;
      //   console.log(`🔒 Advisory lock for id=${id} acquired? ${isJobAllowed}`);
      return isJobAllowed;
    } catch (error) {
      //    console.error("Error acquiring advisory lock with ID:", id, error);
      return false;
    }
  }

  async releaseJobWithId(id: number): Promise<boolean> {
    try {
      const lockNumber = this.backendLayerId + id;

      const result: Array<{ pg_advisory_unlock: boolean }> = await this.prisma.$queryRawUnsafe(
        `SELECT pg_advisory_unlock(${lockNumber});`,
      );

      const released = result[0]?.pg_advisory_unlock === true;
      //    console.log(`🔓 Advisory lock for id=${id} released? ${released}`);

      return released;
    } catch (error) {
      //   console.error("Error releasing advisory lock with ID:", id, error);
      return false;
    }
  }
  /*
  async checkJOB(lockEnum: LockEnum) {
    const clusterWorkerInstance = process.env.CLUSTER_WORKER_INSTANCE; // || "0";
    const isJobsAllowedOnThisInstance = await this.checkInstanceId();
    console.log({
      isJobsAllowedOnThisInstance: isJobsAllowedOnThisInstance,
      isLocal: this.isLocal,
      clusterWorkerInstance: clusterWorkerInstance,
      clusterWorkerInstanceENV: process.env.CLUSTER_WORKER_INSTANCE,
    });
    return (
      isJobsAllowedOnThisInstance &&
      !this.isLocal &&
      clusterWorkerInstance == "0"
    );
  }

  async checkInstanceId(): Promise<boolean> {
    if (this.isLocal) return false;
    try {
      const METADATA_URL = "http://169.254.169.254/latest/meta-data";

      const tokenResponse = await axios.put(
        "http://169.254.169.254/latest/api/token",
        null,
        {
          headers: { "X-aws-ec2-metadata-token-ttl-seconds": "21600" }, // Token valid for 6 hours
          timeout: 1000,
        }
      );

      const token = tokenResponse.data;

      const response = await axios.get(`${METADATA_URL}/instance-id`, {
        headers: { "X-aws-ec2-metadata-token": token },
        timeout: 1000,
      });

      const instanceId = response?.data;
      return instanceId == process.env.PRIMARY_EC2_INSTANCE_ID;
    } catch (error) {
      console.error("Error fetching instance ID:", error.message);
      return false;
    }
  }
    */
}
