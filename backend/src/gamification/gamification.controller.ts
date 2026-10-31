import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('challenges')
  async getChallenges() {
    return this.gamificationService.getActiveChallenges();
  }

  @UseGuards(JwtAuthGuard)
  @Get('progress')
  async getMyProgress(@Request() req) {
    return this.gamificationService.getUserProgress(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('challenges')
  async createCustomChallenge(@Request() req, @Body() body: any) {
    return this.gamificationService.createCustomChallenge(req.user.id, body.title, body.description, body.xpReward);
  }

  @UseGuards(JwtAuthGuard)
  @Put('challenges/:id')
  async editCustomChallenge(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.gamificationService.editCustomChallenge(req.user.id, id, body.title, body.description, body.xpReward);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('challenges/:userChallengeId')
  async deleteUserChallenge(@Request() req, @Param('userChallengeId') userChallengeId: string) {
    return this.gamificationService.deleteUserChallenge(req.user.id, userChallengeId);
  }

  @Get('rewards')
  async getRewards() {
    return this.gamificationService.listRewards();
  }

  @UseGuards(JwtAuthGuard)
  @Post('rewards/:rewardId/redeem')
  async redeemReward(@Request() req, @Param('rewardId') rewardId: string) {
    return this.gamificationService.redeemReward(req.user.id, rewardId);
  }
}
