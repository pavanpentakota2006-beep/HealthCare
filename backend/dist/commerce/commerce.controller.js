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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommerceController = void 0;
const common_1 = require("@nestjs/common");
const commerce_service_1 = require("./commerce.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CommerceController = class CommerceController {
    commerceService;
    constructor(commerceService) {
        this.commerceService = commerceService;
    }
    async getProducts() {
        return this.commerceService.listProducts();
    }
    async getOrders(req) {
        return this.commerceService.getMyOrders(req.user.id);
    }
    async createOrder(req, productId, quantity) {
        return this.commerceService.createOrder(req.user.id, productId, quantity || 1);
    }
};
exports.CommerceController = CommerceController;
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommerceController.prototype, "getProducts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommerceController.prototype, "getOrders", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('orders'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('productId')),
    __param(2, (0, common_1.Body)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], CommerceController.prototype, "createOrder", null);
exports.CommerceController = CommerceController = __decorate([
    (0, common_1.Controller)('commerce'),
    __metadata("design:paramtypes", [commerce_service_1.CommerceService])
], CommerceController);
//# sourceMappingURL=commerce.controller.js.map