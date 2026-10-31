"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemedicineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TelemedicineService = class TelemedicineService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async bookAppointment(patientId, doctorId, scheduledAt) {
        const doctor = await this.prisma.user.findUnique({ where: { id: doctorId } });
        if (!doctor || !['DOCTOR', 'DIETITIAN'].includes(doctor.role)) {
            throw new common_1.NotFoundException('Doctor not found');
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
    async getMyAppointments(userId, role) {
        if (['DOCTOR', 'DIETITIAN'].includes(role)) {
            return this.prisma.appointment.findMany({ where: { doctorId: userId } });
        }
        return this.prisma.appointment.findMany({ where: { patientId: userId } });
    }
};
exports.TelemedicineService = TelemedicineService;
exports.TelemedicineService = TelemedicineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TelemedicineService);
//# sourceMappingURL=telemedicine.service.js.map