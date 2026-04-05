"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(productId, userId) {
        return await this.prisma.$transaction(async (transaction) => {
            const products = await transaction.$queryRawUnsafe(`SELECT * FROM "Product" WHERE ID = ${productId} FOR UPDATE`);
            const product = products[0];
            if (!product || product.stock <= 0) {
                throw new common_1.BadRequestException("재고가 없습니다.");
            }
            await transaction.product.update({
                where: { id: productId },
                data: {
                    stock: product.stock - 1
                },
            });
            await transaction.order.create({
                data: {
                    productId,
                    userId,
                    status: 'COMPLETED'
                }
            });
        });
    }
    async clearOrders() {
        await this.prisma.order.deleteMany({});
        return { message: "주문 내역이 초기화되었습니다." };
    }
    create(createOrderDto) {
        return 'This action adds a new order';
    }
    findAll() {
        return `This action returns all orders`;
    }
    findOne(id) {
        return `This action returns a #${id} order`;
    }
    update(id, updateOrderDto) {
        return `This action updates a #${id} order`;
    }
    remove(id) {
        return `This action removes a #${id} order`;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map