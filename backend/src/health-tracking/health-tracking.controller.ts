import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { HealthTrackingService } from './health-tracking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('health')
export class HealthTrackingController {
  constructor(private readonly healthTrackingService: HealthTrackingService) {}

  @Post('meal')
  async logMeal(@Request() req, @Body() body: any) {
    return this.healthTrackingService.logMeal(req.user.id, body);
  }

  @Get('meal')
  async getMeals(@Request() req) {
    return this.healthTrackingService.getMealLogs(req.user.id);
  }

  @Post('water')
  async logWater(@Request() req, @Body() body: any) {
    return this.healthTrackingService.logWater(req.user.id, body);
  }

  @Get('water')
  async getWater(@Request() req) {
    return this.healthTrackingService.getWaterLogs(req.user.id);
  }

  @Post('sleep')
  async logSleep(@Request() req, @Body() body: any) {
    return this.healthTrackingService.logSleep(req.user.id, body);
  }

  @Get('sleep')
  async getSleep(@Request() req) {
    return this.healthTrackingService.getSleepLogs(req.user.id);
  }

  @Post('workout')
  async logWorkout(@Request() req, @Body() body: any) {
    return this.healthTrackingService.logWorkout(req.user.id, body);
  }

  @Get('workout')
  async getWorkouts(@Request() req) {
    return this.healthTrackingService.getWorkoutLogs(req.user.id);
  }

  @Get('sync')
  async getSync(@Request() req) {
    return this.healthTrackingService.getDashboardSync(req.user.id);
  }

  @Post('sync')
  async postSync(@Request() req, @Body() body: any) {
    return this.healthTrackingService.saveDashboardSync(req.user.id, body);
  }
}
