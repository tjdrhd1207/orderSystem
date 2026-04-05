import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const adapter = new PrismaPg({
            connectionString: "postgresql://postgres:1234@localhost:5432/nest_order_db",
        });
        super({ adapter });
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