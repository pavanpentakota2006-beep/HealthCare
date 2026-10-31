import { CommerceService } from './commerce.service';
export declare class CommerceController {
    private readonly commerceService;
    constructor(commerceService: CommerceService);
    getProducts(): Promise<({
        category: {
            id: string;
            name: string;
            description: string | null;
        };
    } & {
        id: string;
        categoryId: string;
        name: string;
        description: string;
        price: number;
        stock: number;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getOrders(req: any): Promise<({
        items: ({
            product: {
                id: string;
                categoryId: string;
                name: string;
                description: string;
                price: number;
                stock: number;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            priceAtBuy: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalAmount: number;
        status: string;
    })[]>;
    createOrder(req: any, productId: string, quantity?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalAmount: number;
        status: string;
    }>;
}
