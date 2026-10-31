import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body('message') message: string) {
    const reply = await this.aiService.getNutritionAdvice(message);
    return { reply };
  }

  @Post('meal-plan')
  async generateMealPlan(
    @Body('calories') calories: number,
    @Body('dietType') dietType: string,
  ) {
    return this.aiService.generateMealPlan(calories, dietType);
  }
}
