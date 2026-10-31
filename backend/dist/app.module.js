"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const health_tracking_module_1 = require("./health-tracking/health-tracking.module");
const ai_module_1 = require("./ai/ai.module");
const telemedicine_module_1 = require("./telemedicine/telemedicine.module");
const community_module_1 = require("./community/community.module");
const gamification_module_1 = require("./gamification/gamification.module");
const commerce_module_1 = require("./commerce/commerce.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, users_module_1.UsersModule, auth_module_1.AuthModule, health_tracking_module_1.HealthTrackingModule, ai_module_1.AiModule, telemedicine_module_1.TelemedicineModule, community_module_1.CommunityModule, gamification_module_1.GamificationModule, commerce_module_1.CommerceModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map