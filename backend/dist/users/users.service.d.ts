import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOneByEmail(email: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        role: string;
        isVerified: boolean;
        otpSecret: string | null;
        refreshToken: string | null;
        googleId: string | null;
        appleId: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: any): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        role: string;
        isVerified: boolean;
        otpSecret: string | null;
        refreshToken: string | null;
        googleId: string | null;
        appleId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
