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
exports.HealthTrackingController = void 0;
const common_1 = require("@nestjs/common");
const health_tracking_service_1 = require("./health-tracking.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let HealthTrackingController = class HealthTrackingController {
    healthTrackingService;
    constructor(healthTrackingService) {
        this.healthTrackingService = healthTrackingService;
    }
    async logMeal(req, body) {
        return this.healthTrackingService.logMeal(req.user.id, body);
    }
    async getMeals(req) {
        return this.healthTrackingService.getMealLogs(req.user.id);
    }
    async logWater(req, body) {
        return this.healthTrackingService.logWater(req.user.id, body);
    }
    async getWater(req) {
        return this.healthTrackingService.getWaterLogs(req.user.id);
    }
    async logSleep(req, body) {
        return this.healthTrackingService.logSleep(req.user.id, body);
    }
    async getSleep(req) {
        return this.healthTrackingService.getSleepLogs(req.user.id);
    }
    async logWorkout(req, body) {
        return this.healthTrackingService.logWorkout(req.user.id, body);
    }
    async getWorkouts(req) {
        return this.healthTrackingService.getWorkoutLogs(req.user.id);
    }
    async getSync(req) {
        return this.healthTrackingService.getDashboardSync(req.user.id);
    }
    async postSync(req, body) {
        return this.healthTrackingService.saveDashboardSync(req.user.id, body);
    }
};
exports.HealthTrackingController = HealthTrackingController;
__decorate([
    (0, common_1.Post)('meal'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HealthTrackingController.prototype, "logMeal", null);
__decorate([
    (0, common_1.Get)('meal'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HealthTrackingController.prototype, "getMeals", null);
__decorate([
    (0, common_1.Post)('water'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HealthTrackingController.prototype, "logWater", null);
__decorate([
    (0, common_1.Get)('water'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HealthTrackingController.prototype, "getWater", null);
__decorate([
    (0, common_1.Post)('sleep'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HealthTrackingController.prototype, "logSleep", null);
__decorate([
    (0, common_1.Get)('sleep'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HealthTrackingController.prototype, "getSleep", null);
__decorate([
    (0, common_1.Post)('workout'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HealthTrackingController.prototype, "logWorkout", null);
__decorate([
    (0, common_1.Get)('workout'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HealthTrackingController.prototype, "getWorkouts", null);
__decorate([
    (0, common_1.Get)('sync'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HealthTrackingController.prototype, "getSync", null);
__decorate([
    (0, common_1.Post)('sync'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HealthTrackingController.prototype, "postSync", null);
exports.HealthTrackingController = HealthTrackingController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [health_tracking_service_1.HealthTrackingService])
], HealthTrackingController);
//# sourceMappingURL=health-tracking.controller.js.map