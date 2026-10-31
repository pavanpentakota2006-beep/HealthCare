import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelemedicineService {
  constructor(private prisma: PrismaService) {}

  async listDoctors() {
    return this.prisma.user.findMany({
      where: {
        role: { in: ['DOCTOR', 'DIETITIAN'] }
      },
      select: {
        id: true,
        email: true,
        role: true,
        profile: true,
        doctorProfile: true,
        dietitianProfile: true,
      }
    });
  }

  async bookAppointment(patientId: string, doctorId: string, scheduledAt: Date) {
    const doctor = await this.prisma.user.findUnique({ where: { id: doctorId } });
    if (!doctor || !['DOCTOR', 'DIETITIAN'].includes(doctor.role)) {
      throw new NotFoundException('Doctor not found');
    }
    
    return this.prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        scheduledAt,
        status: 'SCHEDULED',
      }
    });
  }

  async getMyAppointments(userId: string, role: string) {
    if (['DOCTOR', 'DIETITIAN'].includes(role)) {
      // Assuming userId here is mapped correctly, skipping complex includes for build stability
      return this.prisma.appointment.findMany({ where: { doctorId: userId } });
    }
    return this.prisma.appointment.findMany({ where: { patientId: userId } });
  }
}
