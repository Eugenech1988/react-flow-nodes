import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEBOUNCE_MS = 500;
const DEFAULT_TAGS: readonly string[] = ['jobs'];

@Injectable()
export class PortalRevalidateService {
  private readonly logger = new Logger(PortalRevalidateService.name);
  private timeout: ReturnType<typeof setTimeout> | null = null;
  private pendingTags = new Set<string>();

  constructor(private readonly configService: ConfigService) {}

  scheduleRevalidate(tags: readonly string[] = DEFAULT_TAGS): void {
    tags.forEach((tag) => this.pendingTags.add(tag));

    if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      void this.flush();
    }, DEBOUNCE_MS);
  }

  private async flush(): Promise<void> {
    const tags = Array.from(this.pendingTags);
    this.pendingTags.clear();
    this.timeout = null;

    if (tags.length === 0) return;

    const portalUrl = this.configService.get<string>('PORTAL_URL');
    const secret = this.configService.get<string>('REVALIDATE_SECRET');

    if (!portalUrl || !secret) {
      this.logger.warn('PORTAL_URL or REVALIDATE_SECRET is not configured');
      return;
    }

    try {
      const response = await fetch(`${portalUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-revalidate-secret': secret,
        },
        body: JSON.stringify({ tags }),
      });

      if (!response.ok) {
        this.logger.warn(
          `Portal revalidate failed with status ${response.status} for tags [${tags.join(', ')}]`,
        );
      }
    } catch (err) {
      this.logger.error('Portal revalidate network error', err);
    }
  }
}