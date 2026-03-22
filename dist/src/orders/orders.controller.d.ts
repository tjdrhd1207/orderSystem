import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: {
        productId: number;
        userId: string;
    }): Promise<void>;
}
