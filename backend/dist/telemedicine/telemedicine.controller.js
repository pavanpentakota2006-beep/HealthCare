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
exports.TelemedicineController = void 0;
const common_1 = require("@nestjs/common");
const telemedicine_service_1 = require("./telemedicine.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
let TelemedicineController = class TelemedicineController {
    telemedicineService;
    constructor(telemedicineService) {
        this.telemedicineService = telemedicineService;
    }
    async getDoctors() {
        return this.telemedicineService.listDoctors();
    }
    async bookAppointment(req, body) {
        const { doctorId, scheduledAt } = body;
        return this.telemedicineService.bookAppointment(req.user.id, doctorId, new Date(scheduledAt));
    }
    async getBookings(req) {
        return this.telemedicineService.getMyAppointments(req.user.id, req.user.role);
    }
};
exports.TelemedicineController = TelemedicineController;
__decorate([
    (0, common_1.Get)('doctors'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getDoctors", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('book'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "bookAppointment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)('bookings'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getBookings", null);
exports.TelemedicineController = TelemedicineController = __decorate([
    (0, common_1.Controller)('telemedicine'),
    __metadata("design:paramtypes", [telemedicine_service_1.TelemedicineService])
], TelemedicineController);
//# sourceMappingURL=telemedicine.controller.js.map