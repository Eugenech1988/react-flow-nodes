import { createMailRouter } from '../mail.router';
import type { MailService } from '@/mail/mail.service';
import type { TrpcContext } from '@/trpc/context';

describe('Mail Router', () => {
  let mockMailService: jest.Mocked<MailService>;
  let router: ReturnType<typeof createMailRouter>;

  const createMockContext = (): TrpcContext => ({
    user: null,
    req: {} as unknown as TrpcContext['req'],
    res: {} as unknown as TrpcContext['res'],
  });

  beforeEach(() => {
    mockMailService = {
      sendRecoveryEmail: jest.fn(),
      sendInquiryEmail: jest.fn(),
      sendApplicationEmail: jest.fn(),
    } as unknown as jest.Mocked<MailService>;

    router = createMailRouter(mockMailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('forwards input to sendInquiryEmail and returns success', async () => {
    mockMailService.sendInquiryEmail.mockResolvedValue(undefined);

    const input = {
      type: 'demo' as const,
      email: 'jane@example.com',
      name: 'Jane Doe',
      company: 'Acme',
      position: 'CTO',
      message: 'Interested in a demo',
    };

    const caller = router.createCaller(createMockContext());
    const result = await caller.sendInquiry(input);

    expect(mockMailService.sendInquiryEmail).toHaveBeenCalledWith(input);
    expect(result).toEqual({ success: true });
  });

  it('does not require authentication', async () => {
    mockMailService.sendInquiryEmail.mockResolvedValue(undefined);

    const caller = router.createCaller(createMockContext());
    await expect(
      caller.sendInquiry({
        type: 'contact',
        email: 'a@b.co',
        name: 'AB',
        company: 'CD',
        position: 'EF',
        message: 'hello there',
      }),
    ).resolves.toEqual({ success: true });
  });

  it('propagates sendInquiryEmail errors', async () => {
    mockMailService.sendInquiryEmail.mockRejectedValueOnce(new Error('SMTP down'));

    const caller = router.createCaller(createMockContext());
    await expect(
      caller.sendInquiry({
        type: 'demo',
        email: 'a@b.co',
        name: 'AB',
        company: 'CD',
        position: 'EF',
        message: 'hello there',
      }),
    ).rejects.toThrow('SMTP down');
  });

  it('rejects invalid input via zod', async () => {
    const caller = router.createCaller(createMockContext());

    await expect(
      // @ts-expect-error deliberately invalid input
      caller.sendInquiry({ email: 'not-an-email' }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });
});
