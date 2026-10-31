import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    getChallenges(): Promise<{
        id: string;
        title: string;
        description: string;
        xpReward: number;
        startDate: Date;
        endDate: Date;
    }[]>;
    getMyProgress(req: any): Promise<{
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
    createCustomChallenge(req: any, body: any): Promise<{
        id: string;
        userId: string;
        challengeId: string;
        progress: number;
        completed: boolean;
    }>;
    editCustomChallenge(req: any, id: string, body: any): Promise<{
        id: string;
        title: string;
        description: string;
        xpReward: number;
        startDate: Date;
        endDate: Date;
    }>;
    deleteUserChallenge(req: any, userChallengeId: string): Promise<{
        id: string;
        userId: string;
        challengeId: string;
        progress: number;
        completed: boolean;
    }>;
    getRewards(): Promise<{
        id: string;
        name: string;
        description: string;
        costCoins: number;
    }[]>;
    redeemReward(req: any, rewardId: string): Promise<{
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
