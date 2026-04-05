import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  async create(@Body() createOrderDto: { productId: number; userId: string } // 인자 바로 앞에!
  ) {
    return await this.ordersService.createOrder(
      createOrderDto.productId,
      createOrderDto.userId,
    );
  }

  @Delete('clear')
  async clearAll() {
    return await this.ordersService.clearOrders();
  }
}
