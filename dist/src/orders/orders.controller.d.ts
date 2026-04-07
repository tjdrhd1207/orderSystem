import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createWithDbLock(body: {
        productId: number;
        userId: string;
    }): Promise<void>;
    createWithRedisLock(body: {
        productId: number;
        userId: string;
    }): Promise<void>;
    clearAll(): Promise<{
        message: string;
    }>;
}
