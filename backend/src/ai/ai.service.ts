import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private readonly logger = new Logger(AiService.name);

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'mock-key',
    });
  }

  async getNutritionAdvice(message: string): Promise<string> {
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
      } catch (error) {
        this.logger.error('OpenAI API Error', error);
      }
    }

    // Fallback to free public LLM (Pollinations.ai) if no API key or if OpenAI fails
    try {
      this.logger.log('Using free Pollinations.ai LLM endpoint for AI Nutritionist');
      const prompt = encodeURIComponent(`SYSTEM: You are a professional AI Nutritionist and Health Coach. Provide actionable, concise, and scientifically accurate diet and workout advice in 1 or 2 short paragraphs. USER: ${message}`);
      const res = await fetch(`https://text.pollinations.ai/${prompt}`);
      
      if (!res.ok) throw new Error('Pollinations API failed');
      const text = await res.text();
      return text || 'Sorry, my neural network is resting. Please try again.';
    } catch (err) {
      this.logger.error('Pollinations API Error', err);
      return "I'm having trouble connecting to the internet right now. But remember: stay hydrated and eat your greens!";
    }
  }

  async generateSocialReply(postContent: string): Promise<string> {
    try {
      this.logger.log('Generating social reply via Pollinations.ai');
      const prompt = encodeURIComponent(`SYSTEM: You are Coach Sarah, a highly encouraging, friendly fitness coach on a social fitness app. Write a very short (1-2 sentences max), enthusiastic reply to the user's post. Use emojis! USER: ${postContent}`);
      const res = await fetch(`https://text.pollinations.ai/${prompt}`);
      
      if (!res.ok) throw new Error('Pollinations API failed');
      const text = await res.text();
      return text || 'Keep up the amazing work! 🚀';
    } catch (err) {
      this.logger.error('Pollinations API Error', err);
      return "Awesome job! Keep crushing it! 🔥";
    }
  }

  async generateMealPlan(calories: number, dietType: string): Promise<any> {
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
    } catch (error) {
      this.logger.error('OpenAI API Error', error);
      throw new Error('Failed to generate meal plan');
    }
  }
}
