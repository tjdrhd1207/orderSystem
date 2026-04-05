import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역에서 환경 변수 사용 가능하게 설정
      envFilePath: '.env', // 루트의 .env를 명시
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService]
})
export class AppModule {}