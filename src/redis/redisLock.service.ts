import { Injectable, Inject } from "@nestjs/common";

// NEST.JS 서비스로 등록
// 어디서든 di로 사용 가능
@Injectable()
export class RedisLockService {
    // RedisModule에서 만든 Redis 연결 객체를 가져다씀
    constructor(
        @Inject('REDIS_CLIENT') private readonly redis: any
    ) {}

    // LOCK 획득
    async acquireLock(key: string, ttl = 3000) {
        const value = `${Date.now()}- ${Math.random()}`;
        const result = await this.redis.set(key, value, 'NX', 'PX', ttl);

        console.log('락 시도:', key, '결과:', result);
        // LOCK 실패 시 ㅜNULL 처리
        if (!result) return null;
        return { key, value };
    }

    // LOCK 해제
    async releaseLock(lock: any) {
        const script = `
            if redis.call("get", KEYS[1]) == ARGV[1]
            then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        `;

        await this.redis.eval(script, 1, lock.key, lock.value);
    }
}