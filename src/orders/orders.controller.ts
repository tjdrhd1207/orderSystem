import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }


  // DB 락 버전
  @Post('db')
  async createWithDbLock(
    @Body() body: { productId: number; userId: string } // 인자 바로 앞에!
  ) {
    return await this.ordersService.createOrderWithDbLock(
      body.productId,
      body.userId,
    );
  }

// Redis락 버전
@Post('redis')
async createWithRedisLock(
  @Body() body: { productId: number; userId: string }
  ) {
    return await this.ordersService.createOrderWithRedisLock(
      body.productId,
      body.userId,
    );
  }

  @Delete('clear')
  async clearAll() {
    return await this.ordersService.clearOrders();
  }
}
