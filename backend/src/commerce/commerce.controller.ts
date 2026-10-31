import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CommerceService } from './commerce.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('commerce')
export class CommerceController {
  constructor(private readonly commerceService: CommerceService) {}

  @Get('products')
  async getProducts() {
    return this.commerceService.listProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  async getOrders(@Request() req) {
    return this.commerceService.getMyOrders(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('orders')
  async createOrder(@Request() req, @Body('productId') productId: string, @Body('quantity') quantity?: number) {
    return this.commerceService.createOrder(req.user.id, productId, quantity || 1);
  }
}
