import { ConfigService } from '@nestjs/config';
export declare class AiService {
  private readonly google;
  constructor(config: ConfigService);
  test(
    message: string,
    system?: string,
  ): Promise<{
    text: string;
  }>;
}
