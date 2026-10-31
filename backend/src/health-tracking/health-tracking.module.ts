import { Module } from '@nestjs/common';
import { HealthTrackingService } from './health-tracking.service';
import { HealthTrackingController } from './health-tracking.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [HealthTrackingService],
  controllers: [HealthTrackingController]
})
export class HealthTrackingModule {}
