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
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GamificationService = class GamificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getActiveChallenges() {
        return this.prisma.challenge.findMany({
            where: {
                endDate: { gte: new Date() }
            }
        });
    }
    async getUserProgress(userId) {
        let userChallenges = await this.prisma.userChallenge.findMany({
            where: { userId },
            include: { challenge: true }
        });
        if (userChallenges.length === 0) {
            const demoChallenge = await this.prisma.challenge.create({
                data: { title: "Hydration Master", description: "Drink 2.5L of water for 5 days.", xpReward: 300, startDate: new Date(), endDate: new Date(Date.now() + 864000000) }
            });
            const demoChallenge2 = await this.prisma.challenge.create({
                data: { title: "7-Day Step Streak", description: "Walk 10,000 steps for 7 consecutive days.", xpReward: 500, startDate: new Date(), endDate: new Date(Date.now() + 864000000) }
            });
            await this.prisma.userChallenge.createMany({
                data: [
                    { userId, challengeId: demoChallenge.id, progress: 1, completed: false },
                    { userId, challengeId: demoChallenge2.id, progress: 3, completed: false }
                ]
            });
            userChallenges = await this.prisma.userChallenge.findMany({ where: { userId }, include: { challenge: true } });
        }
        else {
            for (const uc of userChallenges) {
                if (!uc.completed && Math.random() > 0.5) {
                    await this.prisma.userChallenge.update({
                        where: { id: uc.id },
                        data: { progress: uc.progress + 1 }
                    });
                    uc.progress += 1;
                }
            }
        }
        let userBadges = await this.prisma.userBadge.findMany({
            where: { userId },
            include: { badge: true }
        });
        if (userBadges.length === 0 && Math.random() > 0.5) {
            const badge = await this.prisma.badge.create({
                data: { name: "Early Bird", description: "Logged a workout before 7 AM", iconUrl: "Sparkles" }
            });
            await this.prisma.userBadge.create({
                data: { userId, badgeId: badge.id }
            });
            userBadges = await this.prisma.userBadge.findMany({ where: { userId }, include: { badge: true } });
        }
        return {
            challenges: userChallenges,
            badges: userBadges
        };
    }
    async createCustomChallenge(userId, title, description, xpReward = 100) {
        const challenge = await this.prisma.challenge.create({
            data: {
                title,
                description,
                xpReward,
                startDate: new Date(),
                endDate: new Date(Date.now() + 864000000)
            }
        });
        return this.prisma.userChallenge.create({
            data: {
                userId,
                challengeId: challenge.id,
                progress: 0,
                completed: false
            }
        });
    }
    async editCustomChallenge(userId, challengeId, title, description, xpReward) {
        return this.prisma.challenge.update({
            where: { id: challengeId },
            data: {
                title,
                description,
                xpReward
            }
        });
    }
    async deleteUserChallenge(userId, userChallengeId) {
        return this.prisma.userChallenge.delete({
            where: { id: userChallengeId }
        });
    }
    async listRewards() {
        return this.prisma.reward.findMany();
    }
    async redeemReward(userId, rewardId) {
        const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
        if (!reward)
            throw new Error('Reward not found');
        return this.prisma.userReward.create({
            data: {
                userId,
                rewardId,
                redeemedAt: new Date()
            },
            include: { reward: true }
        });
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map