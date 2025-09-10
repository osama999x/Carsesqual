import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { Logger } from '@nestjs/common';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private static instance: RedisService;
  private static client: RedisClientType;
  private static isInitialized = false;

  constructor(private configService: ConfigService) { }

  // public static getInstance(): RedisService {
  //   if (!RedisService.instance) {
  //     RedisService.instance = new RedisService(new ConfigService());
  //   }
  //   return RedisService.instance;
  // }

  async onModuleInit() {
    console.log('redis config', this.configService.get('redis'));
    if (!RedisService.isInitialized) {
      RedisService.client = createClient({
        url: `redis://${this.configService.get('redis.host')}:${this.configService.get('redis.port')}`,
      });

      RedisService.client.on('error', err => {
        this.logger.error('Error connecting to redis: ', err);
      });

      RedisService.client.on('connect', () => {
        this.logger.log('### -> Connected to redis');
      });

      await RedisService.client.connect();
      RedisService.isInitialized = true;
    }
  }

  async onModuleDestroy() {
    if (RedisService.client) {
      await RedisService.client.quit();
    }
  }

  getClient(): RedisClientType {
    return RedisService.client;
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await RedisService.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async getByPattern<T>(pattern: string): Promise<Record<string, T>> {
    const keys = await RedisService.client.keys(pattern);
    if (keys.length === 0) return {};

    const values = await RedisService.client.mGet(keys);
    const result: Record<string, T> = {};

    keys.forEach((key, index) => {
      const value = values[index];
      if (value) result[key] = JSON.parse(value);
    });

    return result;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await RedisService.client.setEx(key, ttl, stringValue);
    } else {
      await RedisService.client.set(key, stringValue);
    }
  }

  async del(key: string): Promise<void> {
    await RedisService.client.del(key);
  }

  async clear(): Promise<void> {
    await RedisService.client.flushAll();
  }

  // Add this method
  getRawClient(): RedisClientType {
    return RedisService.client;
  }

}
