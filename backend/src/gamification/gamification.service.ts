import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  async getActiveChallenges() {
    return this.prisma.challenge.findMany({
      where: {
        endDate: { gte: new Date() }
      }
    });
  }

  async getUserProgress(userId: string) {
    let userChallenges = await this.prisma.userChallenge.findMany({
      where: { userId },
      include: { challenge: true }
    });
    
    // Seed initial challenges if empty
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
    } else {
      // Simulate progress for the showcase by incrementing progress slightly every time they check
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
      // Simulate unlocking a badge!
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

  async createCustomChallenge(userId: string, title: string, description: string, xpReward: number = 100) {
    const challenge = await this.prisma.challenge.create({
      data: {
        title,
        description,
        xpReward,
        startDate: new Date(),
        endDate: new Date(Date.now() + 864000000) // 10 days
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

  async editCustomChallenge(userId: string, challengeId: string, title: string, description: string, xpReward: number) {
    return this.prisma.challenge.update({
      where: { id: challengeId },
      data: {
        title,
        description,
        xpReward
      }
    });
  }

  async deleteUserChallenge(userId: string, userChallengeId: string) {
    return this.prisma.userChallenge.delete({
      where: { id: userChallengeId }
    });
  }

  async listRewards() {
    return this.prisma.reward.findMany();
  }

  async redeemReward(userId: string, rewardId: string) {
    const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward) throw new Error('Reward not found');

    return this.prisma.userReward.create({
      data: {
        userId,
        rewardId,
        redeemedAt: new Date()
      },
      include: { reward: true }
    });
  }
}
