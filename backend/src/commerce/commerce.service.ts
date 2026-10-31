import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommerceService {
  constructor(private prisma: PrismaService) {}

  async listProducts() {
    return this.prisma.product.findMany({
      include: { category: true }
    });
  }

  async getMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createOrder(userId: string, productId: string, quantity: number = 1) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    const totalAmount = product.price * quantity;

    return this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: "PAID", // Simulated instant checkout
        items: {
          create: [{
            productId,
            quantity,
            priceAtBuy: product.price
          }]
        }
      }
    });
  }
}
