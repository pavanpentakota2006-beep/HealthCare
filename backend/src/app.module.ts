import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HealthTrackingModule } from './health-tracking/health-tracking.module';
import { AiModule } from './ai/ai.module';
import { TelemedicineModule } from './telemedicine/telemedicine.module';
import { CommunityModule } from './community/community.module';
import { GamificationModule } from './gamification/gamification.module';
import { CommerceModule } from './commerce/commerce.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, HealthTrackingModule, AiModule, TelemedicineModule, CommunityModule, GamificationModule, CommerceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
