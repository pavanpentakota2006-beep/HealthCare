import { PrismaService } from '../prisma/prisma.service';
export declare class GamificationService {
    private prisma;
    constructor(prisma: PrismaService);
    getActiveChallenges(): Promise<{
        id: string;
        title: string;
        description: string;
        xpReward: number;
        startDate: Date;
        endDate: Date;
    }[]>;
    getUserProgress(userId: string): Promise<{
        challenges: ({
            challenge: {
                id: string;
                title: string;
                description: string;
                xpReward: number;
                startDate: Date;
                endDate: Date;
            };
        } & {
            id: string;
            userId: string;
            challengeId: string;
            progress: number;
            completed: boolean;
        })[];
        badges: ({
            badge: {
                id: string;
                name: string;
                description: string;
                iconUrl: string;
            };
        } & {
            id: string;
            userId: string;
            badgeId: string;
            awardedAt: Date;
        })[];
    }>;
    createCustomChallenge(userId: string, title: string, description: string, xpReward?: number): Promise<{
        id: string;
        userId: string;
        challengeId: string;
        progress: number;
        completed: boolean;
    }>;
    editCustomChallenge(userId: string, challengeId: string, title: string, description: string, xpReward: number): Promise<{
        id: string;
        title: string;
        description: string;
        xpReward: number;
        startDate: Date;
        endDate: Date;
    }>;
    deleteUserChallenge(userId: string, userChallengeId: string): Promise<{
        id: string;
        userId: string;
        challengeId: string;
        progress: number;
        completed: boolean;
    }>;
    listRewards(): Promise<{
        id: string;
        name: string;
        description: string;
        costCoins: number;
    }[]>;
    redeemReward(userId: string, rewardId: string): Promise<{
        reward: {
            id: string;
            name: string;
            description: string;
            costCoins: number;
        };
    } & {
        id: string;
        userId: string;
        redeemedAt: Date;
        rewardId: string;
    }>;
}
