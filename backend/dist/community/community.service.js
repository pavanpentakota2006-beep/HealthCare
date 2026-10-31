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
exports.CommunityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
let CommunityService = class CommunityService {
    prisma;
    aiService;
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
    }
    async listPosts() {
        return this.prisma.post.findMany({
            include: {
                user: { select: { id: true, email: true, profile: { select: { firstName: true, avatarUrl: true } } } },
                comments: { include: { user: { select: { id: true, email: true, profile: { select: { firstName: true, avatarUrl: true } } } } } },
                _count: { select: { likes: true, comments: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async createPost(userId, content) {
        const post = await this.prisma.post.create({
            data: {
                userId,
                content
            }
        });
        this.simulateCommunityInteraction(post.id, content);
        return post;
    }
    async simulateCommunityInteraction(postId, postContent) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const aiReply = await this.aiService.generateSocialReply(postContent);
        const personas = ["Alex Strong 💪", "Jordan Fitness", "Taylor Runner 🏃‍♂️", "Sam The Lifter"];
        const randomPersona = personas[Math.floor(Math.random() * personas.length)];
        const fakeEmail = `${randomPersona.split(' ')[0].toLowerCase()}@healthcare.ai`;
        let replier = await this.prisma.user.findFirst({ where: { email: fakeEmail } });
        if (!replier) {
            replier = await this.prisma.user.create({
                data: {
                    email: fakeEmail,
                    passwordHash: 'ai-no-login',
                    profile: {
                        create: {
                            firstName: randomPersona,
                            lastName: ''
                        }
                    }
                }
            });
        }
        await this.prisma.comment.create({
            data: {
                postId,
                userId: replier.id,
                content: aiReply
            }
        });
        await this.prisma.like.create({
            data: { userId: replier.id, postId }
        }).catch(() => { });
        const numLikes = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < numLikes; i++) {
            let fan = await this.prisma.user.findFirst({ where: { email: `fan${i}@healthcare.ai` } });
            if (!fan) {
                fan = await this.prisma.user.create({
                    data: {
                        email: `fan${i}@healthcare.ai`,
                        passwordHash: 'ai-no-login',
                        profile: { create: { firstName: `Member ${i}`, lastName: '' } }
                    }
                });
            }
            const existingLike = await this.prisma.like.findUnique({
                where: { userId_postId: { userId: fan.id, postId } }
            });
            if (!existingLike) {
                await this.prisma.like.create({
                    data: { userId: fan.id, postId }
                });
            }
        }
    }
    async addComment(userId, postId, content) {
        return this.prisma.comment.create({
            data: {
                userId,
                postId,
                content
            }
        });
    }
    async deleteComment(userId, commentId) {
        return this.prisma.comment.delete({
            where: { id: commentId }
        });
    }
    async deletePost(userId, postId) {
        return this.prisma.post.delete({
            where: { id: postId }
        });
    }
};
exports.CommunityService = CommunityService;
exports.CommunityService = CommunityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], CommunityService);
//# sourceMappingURL=community.service.js.map