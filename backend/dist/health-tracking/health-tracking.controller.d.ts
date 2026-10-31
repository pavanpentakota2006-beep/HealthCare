import { HealthTrackingService } from './health-tracking.service';
export declare class HealthTrackingController {
    private readonly healthTrackingService;
    constructor(healthTrackingService: HealthTrackingService);
    logMeal(req: any, body: any): Promise<{
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
    getMeals(req: any): Promise<{
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
    logWater(req: any, body: any): Promise<{
        id: string;
        loggedAt: Date;
        userId: string;
        amountMl: number;
    }>;
    getWater(req: any): Promise<{
        id: string;
        loggedAt: Date;
        userId: string;
        amountMl: number;
    }[]>;
    logSleep(req: any, body: any): Promise<{
        id: string;
        loggedAt: Date;
        userId: string;
        durationMin: number;
        quality: number | null;
    }>;
    getSleep(req: any): Promise<{
        id: string;
        loggedAt: Date;
        userId: string;
        durationMin: number;
        quality: number | null;
    }[]>;
    logWorkout(req: any, body: any): Promise<{
        id: string;
        loggedAt: Date;
        userId: string;
        durationMin: number;
        type: string;
        caloriesBurned: number | null;
    }>;
    getWorkouts(req: any): Promise<{
        id: string;
        loggedAt: Date;
        userId: string;
        durationMin: number;
        type: string;
        caloriesBurned: number | null;
    }[]>;
    getSync(req: any): Promise<{
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
    postSync(req: any, body: any): Promise<{
        success: boolean;
    }>;
}
