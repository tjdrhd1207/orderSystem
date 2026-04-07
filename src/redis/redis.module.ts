// redis.module.ts
import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisLockService } from './redisLock.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: 'localhost',
          port: 6379,
        });
      },
    },
    RedisLockService
  ],
  exports: ['REDIS_CLIENT', RedisLockService],
})
export class RedisModule {}