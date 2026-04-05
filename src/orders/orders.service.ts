import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma.service';
import { trace } from 'console';
import { Backoffs } from 'bullmq';

@Injectable()
export class OrdersService {

  // constructor에서 PrismaService를 주입받음
  constructor(private prisma: PrismaService) { }

  // 조회 후 수정방식
  // 동시성 문제 발생하는 로직
  /* async createOrder(productId: number, userId: string) {
    // 1. 재고 조회
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    // 2. 재고 확인
    if (!product || product.stock <= 0) {
      throw new BadRequestException('재고가 없습니다.');
    }

    // 3. 재고 감소
    await this.prisma.product.update({
      where: { id: productId },
      data: { stock: product.stock - 1 }
    });

    // 4. 주문 생성
    await this.prisma.order.create({
      data: {
        productId,
        userId,
        status: 'COMPLETED',
      },
    });

  } */
  async createOrder(productId: number, userId: string) {
    return await this.prisma.$transaction(async(transaction) => {
      
      // 1. 비관적 락
      const products = await transaction.$queryRawUnsafe<any[]> (
        `SELECT * FROM "Product" WHERE ID = ${productId} FOR UPDATE`
      );

      const product = products[0];

      // 2. 재고 확인
      if (!product || product.stock <= 0) {
        throw new BadRequestException("재고가 없습니다.");
      }

      // 3. 재고 감소
      await transaction.product.update({
        where: { id: productId },
        data: {
          stock: product.stock - 1
        },
      });

      // 4. 주문 생성
      await transaction.order.create({
        data: {
          productId,
          userId,
          status: 'COMPLETED'
        }
      })
    })
  }

  async clearOrders () {
    await this.prisma.order.deleteMany({});

    return {message: "주문 내역이 초기화되었습니다."};
  }


  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
