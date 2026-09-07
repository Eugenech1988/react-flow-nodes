import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from '@/ai/ai.service';

const mockModel = jest.fn();
const mockGoogleProvider = jest.fn().mockReturnValue(mockModel);

jest.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: jest.fn(() => mockGoogleProvider),
}));

jest.mock('ai', () => ({
  generateText: jest.fn(),
}));

// import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

describe('AiService', () => {
  let service: AiService;
  let configService: ConfigService;

  const mockApiKey = 'test-api-key';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue(mockApiKey),
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('test', () => {
    it('should generate text successfully', async () => {
      const mockPrompt = 'Hello, world!';
      const mockResponseText = 'Generated response';

      (generateText as jest.Mock).mockResolvedValue({
        text: mockResponseText,
      });

      const result = await service.test(mockPrompt);

      expect(generateText).toHaveBeenCalledWith({
        model: mockModel,
        prompt: mockPrompt,
      });

      expect(mockGoogleProvider).toHaveBeenCalledWith('gemini-3.6-flash');

      expect(result).toEqual({ text: mockResponseText });
    });
  });
});