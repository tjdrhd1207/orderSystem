import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        } as any);
    }
    async onModuleInit() {
        try {
            // 연결 시도 전에 현재 DATABASE_URL이 잘 인식되는지 확인용 로그
            await this.$connect();
            console.log('✅ [Prisma] Database connected successfully!');
        } catch (error) {
            console.error('❌ [Prisma] Database connection failed!');
            console.error(error);
        }
    }
}