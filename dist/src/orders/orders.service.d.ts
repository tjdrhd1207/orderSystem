import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma.service';
import { RedisLockService } from 'src/redis/redisLock.service';
export declare class OrdersService {
    private prisma;
    private readonly redisLockService;
    constructor(prisma: PrismaService, redisLockService: RedisLockService);
    createOrderWithDbLock(productId: number, userId: string): Promise<void>;
    createOrderWithRedisLock(productId: number, userId: string): Promise<void>;
    clearOrders(): Promise<{
        message: string;
    }>;
    create(createOrderDto: CreateOrderDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateOrderDto: UpdateOrderDto): string;
    remove(id: number): string;
}
