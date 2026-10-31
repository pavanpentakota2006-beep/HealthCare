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
        createdAt: Date;
        updatedAt: Date;
        name: string;
        imageUrl: string | null;
        description: string;
        categoryId: string;
        price: number;
        stock: number;
    })[]>;
    getOrders(req: any): Promise<({
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
    createOrder(req: any, productId: string, quantity?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        totalAmount: number;
    }>;
}
