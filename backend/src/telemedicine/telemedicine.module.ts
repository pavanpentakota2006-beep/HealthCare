import { Module } from '@nestjs/common';
import { TelemedicineService } from './telemedicine.service';
import { TelemedicineController } from './telemedicine.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TelemedicineService],
  controllers: [TelemedicineController]
})
export class TelemedicineModule {}
