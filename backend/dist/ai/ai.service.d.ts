export declare class AiService {
    private openai;
    private readonly logger;
    constructor();
    getNutritionAdvice(message: string): Promise<string>;
    generateSocialReply(postContent: string): Promise<string>;
    generateMealPlan(calories: number, dietType: string): Promise<any>;
}
