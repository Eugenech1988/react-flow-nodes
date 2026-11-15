import { ConfigService } from '@nestjs/config';
export declare class PortalRevalidateService {
  private readonly configService;
  private readonly logger;
  private timeout;
  private pendingTags;
  constructor(configService: ConfigService);
  scheduleRevalidate(tags?: readonly string[]): void;
  private flush;
}
