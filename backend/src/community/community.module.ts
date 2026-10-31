import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { PrismaModule } from '../prisma/prisma.module';

import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  providers: [CommunityService],
  controllers: [CommunityController]
})
export class CommunityModule {}
