import { PrismaService } from '../prisma/prisma.service';
export declare class HealthTrackingService {
    private prisma;
    constructor(prisma: PrismaService);
    logMeal(userId: string, data: any): Promise<{
        id: string;
        name: string;
        calories: number;
        proteinG: number | null;
        carbsG: number | null;
        fatG: number | null;
        imageUrl: string | null;
        loggedAt: Date;
        userId: string;
    }>;
    getMealLogs(userId: string): Promise<{
        id: string;
        name: string;
        calories: number;
        proteinG: number | null;
        carbsG: number | null;
        fatG: number | null;
        imageUrl: string | null;
        loggedAt: Date;
        userId: string;
    }[]>;
    logWater(userId: string, data: any): Promise<{
        id: string;
        loggedAt: Date;
        userId: string;
        amountMl: number;
    }>;
    getWaterLogs(userId: string): Promise<{
        id: string;
        loggedAt: Date;
        userId: string;
        amountMl: number;
    }[]>;
    logSleep(userId: string, data: any): Promise<{
        id: string;
        loggedAt: Date;
        userId: string;
        durationMin: number;
        quality: number | null;
    }>;
    getSleepLogs(userId: string): Promise<{
        id: string;
        loggedAt: Date;
        userId: string;
        durationMin: number;
        quality: number | null;
    }[]>;
    logWorkout(userId: string, data: any): Promise<{
        id: string;
        loggedAt: Date;
        userId: string;
        durationMin: number;
        type: string;
        caloriesBurned: number | null;
    }>;
    getWorkoutLogs(userId: string): Promise<{
        id: string;
        loggedAt: Date;
        userId: string;
        durationMin: number;
        type: string;
        caloriesBurned: number | null;
    }[]>;
    getDashboardSync(userId: string): Promise<{
        stats: {
            heightCm: number;
            weightKg: number;
            age: number;
            foodPreference: string;
            dailyCalorieGoal: number;
            dailyWaterGoal: number;
            dailySleepGoal: number;
            dailyActivityGoal: number;
        };
        healthData: {
            meals: {
                id: string;
                name: string;
                calories: number;
                time: string;
                type: string;
            }[];
            workouts: {
                id: string;
                name: string;
                duration: string;
                intensity: string;
                caloriesBurned: number;
            }[];
            waterIntake: number;
            sleepHours: number;
            sleepMinutes: number;
            appointments: {
                id: string;
                doctorName: string;
                specialty: string;
                date: string;
                time: string;
                status: string;
            }[];
        };
    }>;
    saveDashboardSync(userId: string, data: any): Promise<{
        success: boolean;
    }>;
}
