import { Module } from '@nestjs/common';
import { DbLockService } from './dblocks.service';

@Module({
  imports: [],
  providers: [DbLockService],
})
export class DbLockModule { }
