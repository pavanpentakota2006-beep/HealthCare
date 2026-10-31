import { TelemedicineService } from './telemedicine.service';
export declare class TelemedicineController {
    private readonly telemedicineService;
    constructor(telemedicineService: TelemedicineService);
    getDoctors(): Promise<{
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatarUrl: string | null;
            dateOfBirth: Date | null;
            gender: string | null;
            country: string | null;
            userId: string;
        } | null;
        doctorProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            specialization: string;
            licenseNumber: string;
            yearsExperience: number;
            consultationFee: number;
            bio: string | null;
        } | null;
        dietitianProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            yearsExperience: number;
            consultationFee: number;
            bio: string | null;
            certifications: string;
        } | null;
        id: string;
        email: string;
        role: string;
    }[]>;
    bookAppointment(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string | null;
        dietitianId: string | null;
        scheduledAt: Date;
        status: string;
        meetingLink: string | null;
        notes: string | null;
    }>;
    getBookings(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string | null;
        dietitianId: string | null;
        scheduledAt: Date;
        status: string;
        meetingLink: string | null;
        notes: string | null;
    }[]>;
}
