"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisLockService = void 0;
const common_1 = require("@nestjs/common");
let RedisLockService = class RedisLockService {
    constructor(redis) {
        this.redis = redis;
    }
    async acquireLock(key, ttl = 3000) {
        const value = `${Date.now()}- ${Math.random()}`;
        const result = await this.redis.set(key, value, 'NX', 'PX', ttl);
        console.log('락 시도:', key, '결과:', result);
        if (!result)
            return null;
        return { key, value };
    }
    async releaseLock(lock) {
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
};
exports.RedisLockService = RedisLockService;
exports.RedisLockService = RedisLockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [Object])
], RedisLockService);
//# sourceMappingURL=redisLock.service.js.map