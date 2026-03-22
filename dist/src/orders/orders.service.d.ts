import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(productId: number, userId: string): Promise<void>;
    create(createOrderDto: CreateOrderDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateOrderDto: UpdateOrderDto): string;
    remove(id: number): string;
}
