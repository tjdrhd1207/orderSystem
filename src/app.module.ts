import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역에서 환경 변수 사용 가능하게 설정
      envFilePath: '.env', // 루트의 .env를 명시
    }),
  ],
})
export class AppModule {}