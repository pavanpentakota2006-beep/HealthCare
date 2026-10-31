import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TelemedicineService } from './telemedicine.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('telemedicine')
export class TelemedicineController {
  constructor(private readonly telemedicineService: TelemedicineService) {}

  @Get('doctors')
  async getDoctors() {
    return this.telemedicineService.listDoctors();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('book')
  async bookAppointment(@Request() req, @Body() body: any) {
    const { doctorId, scheduledAt } = body;
    return this.telemedicineService.bookAppointment(req.user.id, doctorId, new Date(scheduledAt));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('bookings')
  async getBookings(@Request() req) {
    return this.telemedicineService.getMyAppointments(req.user.id, req.user.role);
  }
}
