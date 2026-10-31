import { PrismaService } from '../prisma/prisma.service';
export declare class CommerceService {
    private prisma;
    constructor(prisma: PrismaService);
    listProducts(): Promise<({
        category: {
            id: string;
            name: string;
            description: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        imageUrl: string | null;
        description: string;
        categoryId: string;
        price: number;
        stock: number;
    })[]>;
    getMyOrders(userId: string): Promise<({
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                imageUrl: string | null;
                description: string;
                categoryId: string;
                price: number;
                stock: number;
            };
        } & {
            id: string;
            quantity: number;
            priceAtBuy: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        totalAmount: number;
    })[]>;
    createOrder(userId: string, productId: string, quantity?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        totalAmount: number;
    }>;
}
