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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = __importDefault(require("openai"));
let AiService = AiService_1 = class AiService {
    openai;
    logger = new common_1.Logger(AiService_1.name);
    constructor() {
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY || 'mock-key',
        });
    }
    async getNutritionAdvice(message) {
        if (process.env.OPENAI_API_KEY) {
            try {
                const response = await this.openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: 'You are a professional AI Nutritionist and Health Coach. Provide actionable, concise, and scientifically accurate diet and workout advice.' },
                        { role: 'user', content: message }
                    ],
                });
                return response.choices[0].message.content || 'I could not generate an answer.';
            }
            catch (error) {
                this.logger.error('OpenAI API Error', error);
            }
        }
        try {
            this.logger.log('Using free Pollinations.ai LLM endpoint for AI Nutritionist');
            const prompt = encodeURIComponent(`SYSTEM: You are a professional AI Nutritionist and Health Coach. Provide actionable, concise, and scientifically accurate diet and workout advice in 1 or 2 short paragraphs. USER: ${message}`);
            const res = await fetch(`https://text.pollinations.ai/${prompt}`);
            if (!res.ok)
                throw new Error('Pollinations API failed');
            const text = await res.text();
            return text || 'Sorry, my neural network is resting. Please try again.';
        }
        catch (err) {
            this.logger.error('Pollinations API Error', err);
            return "I'm having trouble connecting to the internet right now. But remember: stay hydrated and eat your greens!";
        }
    }
    async generateSocialReply(postContent) {
        try {
            this.logger.log('Generating social reply via Pollinations.ai');
            const prompt = encodeURIComponent(`SYSTEM: You are Coach Sarah, a highly encouraging, friendly fitness coach on a social fitness app. Write a very short (1-2 sentences max), enthusiastic reply to the user's post. Use emojis! USER: ${postContent}`);
            const res = await fetch(`https://text.pollinations.ai/${prompt}`);
            if (!res.ok)
                throw new Error('Pollinations API failed');
            const text = await res.text();
            return text || 'Keep up the amazing work! 🚀';
        }
        catch (err) {
            this.logger.error('Pollinations API Error', err);
            return "Awesome job! Keep crushing it! 🔥";
        }
    }
    async generateMealPlan(calories, dietType) {
        if (!process.env.OPENAI_API_KEY) {
            return {
                status: "mock",
                plan: `Mock 3-day meal plan for ${calories} kcal (${dietType})`
            };
        }
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                response_format: { type: 'json_object' },
                messages: [
                    { role: 'system', content: 'You are a meal planning AI. Output a JSON object containing a "mealPlan" array with breakfast, lunch, and dinner.' },
                    { role: 'user', content: `Generate a daily meal plan for ${calories} calories following a ${dietType} diet.` }
                ],
            });
            return JSON.parse(response.choices[0].message.content || '{}');
        }
        catch (error) {
            this.logger.error('OpenAI API Error', error);
            throw new Error('Failed to generate meal plan');
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AiService);
//# sourceMappingURL=ai.service.js.map