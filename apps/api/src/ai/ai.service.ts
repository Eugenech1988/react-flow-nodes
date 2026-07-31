import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

@Injectable()
export class AiService {
  private readonly google;

  constructor(config: ConfigService) {
    this.google = createGoogleGenerativeAI({
      apiKey: config.getOrThrow<string>('GOOGLE_GENERATIVE_AI_API_KEY'),
    });
  }

  async test(message: string) {
    const { text } = await generateText({
      model: this.google('gemini-3.6-flash'),
      prompt: message,
    });

    return { text };
  }
}