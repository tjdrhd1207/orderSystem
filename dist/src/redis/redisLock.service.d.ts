export declare class RedisLockService {
    private readonly redis;
    constructor(redis: any);
    acquireLock(key: string, ttl?: number): Promise<{
        key: string;
        value: string;
    }>;
    releaseLock(lock: any): Promise<void>;
}
