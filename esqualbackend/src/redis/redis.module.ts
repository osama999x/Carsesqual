import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
    providers: [RedisService],  // ✅ let Nest handle instantiation
    exports: [RedisService],
})
export class RedisModule { }
