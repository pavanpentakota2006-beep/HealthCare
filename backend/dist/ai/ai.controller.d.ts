import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    chat(message: string): Promise<{
        reply: string;
    }>;
    generateMealPlan(calories: number, dietType: string): Promise<any>;
}
