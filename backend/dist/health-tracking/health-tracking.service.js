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
exports.HealthTrackingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HealthTrackingService = class HealthTrackingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logMeal(userId, data) {
        return this.prisma.mealLog.create({ data: { ...data, userId } });
    }
    async getMealLogs(userId) {
        return this.prisma.mealLog.findMany({ where: { userId }, orderBy: { loggedAt: 'desc' } });
    }
    async logWater(userId, data) {
        return this.prisma.waterLog.create({ data: { ...data, userId } });
    }
    async getWaterLogs(userId) {
        return this.prisma.waterLog.findMany({ where: { userId }, orderBy: { loggedAt: 'desc' } });
    }
    async logSleep(userId, data) {
        return this.prisma.sleepLog.create({ data: { ...data, userId } });
    }
    async getSleepLogs(userId) {
        return this.prisma.sleepLog.findMany({ where: { userId }, orderBy: { loggedAt: 'desc' } });
    }
    async logWorkout(userId, data) {
        return this.prisma.workoutLog.create({ data: { ...data, userId } });
    }
    async getWorkoutLogs(userId) {
        return this.prisma.workoutLog.findMany({ where: { userId }, orderBy: { loggedAt: 'desc' } });
    }
    async getDashboardSync(userId) {
        const record = await this.prisma.healthRecord.findUnique({ where: { userId } });
        const rawMeals = await this.prisma.mealLog.findMany({ where: { userId }, orderBy: { loggedAt: 'desc' } });
        const rawWorkouts = await this.prisma.workoutLog.findMany({ where: { userId }, orderBy: { loggedAt: 'desc' } });
        const rawWater = await this.prisma.waterLog.findMany({ where: { userId } });
        const sleepEntry = await this.prisma.sleepLog.findFirst({ where: { userId }, orderBy: { loggedAt: 'desc' } });
        const rawAppts = await this.prisma.appointment.findMany({
            where: { patientId: userId },
            include: {
                doctor: { include: { user: { include: { profile: true } } } },
                dietitian: { include: { user: { include: { profile: true } } } }
            },
            orderBy: { scheduledAt: 'asc' }
        });
        const meals = rawMeals.map(m => {
            let type = "Meal";
            const lower = m.name.toLowerCase();
            if (lower.includes("toast") || lower.includes("egg") || lower.includes("oat") || lower.includes("breakfast"))
                type = "Breakfast";
            else if (lower.includes("salmon") || lower.includes("bowl") || lower.includes("salad") || lower.includes("lunch"))
                type = "Lunch";
            else if (lower.includes("yogurt") || lower.includes("bar") || lower.includes("shake") || lower.includes("chia") || lower.includes("snack"))
                type = "Snack";
            else if (lower.includes("chicken") || lower.includes("dinner") || lower.includes("steak") || lower.includes("soup"))
                type = "Dinner";
            return {
                id: m.id,
                name: m.name,
                calories: m.calories,
                time: m.loggedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type
            };
        });
        const workouts = rawWorkouts.map(w => ({
            id: w.id,
            name: w.type,
            duration: w.durationMin.toString(),
            intensity: "Medium",
            caloriesBurned: w.caloriesBurned || 0
        }));
        const appointments = rawAppts.map(a => {
            let docName = "Specialist";
            let spec = "General Consultation";
            if (a.doctor) {
                const p = a.doctor.user?.profile;
                docName = p ? `Dr. ${p.firstName} ${p.lastName || ''}`.trim() : "Dr. Specialist";
                spec = a.doctor.specialization || "Cardiologist";
            }
            else if (a.dietitian) {
                const p = a.dietitian.user?.profile;
                docName = p ? `Dt. ${p.firstName} ${p.lastName || ''}`.trim() : "Dt. Specialist";
                spec = a.dietitian.certifications || "Clinical Dietitian";
            }
            return {
                id: a.id,
                doctorName: docName,
                specialty: spec,
                date: a.scheduledAt.toISOString().split('T')[0],
                time: a.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: a.status
            };
        });
        const totalWater = rawWater.reduce((sum, w) => sum + w.amountMl, 0);
        return {
            stats: {
                heightCm: record?.heightCm || 178,
                weightKg: record?.weightKg || 71.5,
                age: 29,
                foodPreference: record?.allergies || "Balanced Nutrition",
                dailyCalorieGoal: 2200,
                dailyWaterGoal: 2500,
                dailySleepGoal: 8,
                dailyActivityGoal: 60
            },
            healthData: {
                meals: meals.length > 0 ? meals : [
                    { id: "m-1", name: "Herb-Roasted Chicken Breast & Asparagus", calories: 530, time: "07:30 PM", type: "Dinner" },
                    { id: "m-2", name: "Greek Yogurt with Blueberries & Chia", calories: 210, time: "04:15 PM", type: "Snack" },
                    { id: "m-3", name: "Mediterranean Salmon & Quinoa Bowl", calories: 650, time: "01:00 PM", type: "Lunch" },
                    { id: "m-4", name: "Avocado Toast & Poached Eggs", calories: 420, time: "08:15 AM", type: "Breakfast" }
                ],
                workouts: workouts.length > 0 ? workouts : [
                    { id: "w-1", name: "Morning HIIT & Core Interval", duration: "45", intensity: "High", caloriesBurned: 380 },
                    { id: "w-2", name: "Evening Vinyasa Yoga & Mobility", duration: "30", intensity: "Medium", caloriesBurned: 130 }
                ],
                waterIntake: totalWater > 0 ? totalWater : 2100,
                sleepHours: sleepEntry ? Math.floor(sleepEntry.durationMin / 60) : 7,
                sleepMinutes: sleepEntry ? sleepEntry.durationMin % 60 : 45,
                appointments: appointments.length > 0 ? appointments : [
                    { id: "apt-1", doctorName: "Dr. Priya Sharma", specialty: "Cardiologist", date: "2026-11-03", time: "10:00 AM", status: "SCHEDULED" },
                    { id: "apt-2", doctorName: "Dt. Kavya Nair", specialty: "Clinical Dietitian", date: "2026-11-06", time: "04:30 PM", status: "SCHEDULED" }
                ]
            }
        };
    }
    async saveDashboardSync(userId, data) {
        const { stats, healthData } = data;
        if (stats) {
            await this.prisma.healthRecord.upsert({
                where: { userId },
                create: { userId, heightCm: stats.heightCm, weightKg: stats.weightKg, allergies: stats.foodPreference },
                update: { heightCm: stats.heightCm, weightKg: stats.weightKg, allergies: stats.foodPreference }
            });
        }
        if (healthData?.meals) {
            for (const m of healthData.meals) {
                if (typeof m.id === 'number' && m.id > 1000000) {
                    await this.prisma.mealLog.create({
                        data: {
                            userId,
                            name: m.name,
                            calories: m.calories
                        }
                    }).catch(() => { });
                }
            }
        }
        return { success: true };
    }
};
exports.HealthTrackingService = HealthTrackingService;
exports.HealthTrackingService = HealthTrackingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthTrackingService);
//# sourceMappingURL=health-tracking.service.js.map