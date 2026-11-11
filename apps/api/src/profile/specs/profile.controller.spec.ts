import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from '@/profile/profile.controller';
import { ProfileService } from '@/profile/profile.service';
import { updateProfileInputSchema } from '@pipeline/contracts';

jest.mock('@pipeline/contracts', () => ({
  updateProfileInputSchema: {
    parse: jest.fn((data: unknown) => data),
  },
}));

type TUpdatedUser = Awaited<ReturnType<ProfileService['update']>>;
type TMockProfileService = jest.Mocked<Pick<ProfileService, 'update'>>;

const createMockProfileService = (): TMockProfileService => ({
  update: jest.fn(),
});

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: TMockProfileService;

  beforeEach(async () => {
    service = createMockProfileService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [{ provide: ProfileService, useValue: service }],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateProfile', () => {
    it('validates body and returns safe user without password', async () => {
      const userId = 'user_1';
      const body = { firstName: 'John', lastName: 'Doe' };
      const updatedUser = {
        id: userId,
        email: 'john@example.com',
        password: 'hashed_password_secret',
        profile: { firstName: 'John', lastName: 'Doe' },
      } as TUpdatedUser;

      service.update.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(userId, body);

      expect(updateProfileInputSchema.parse).toHaveBeenCalledWith(body);
      expect(service.update).toHaveBeenCalledWith(userId, {
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: undefined,
      });
      expect(result).not.toHaveProperty('password');
      expect(result).toEqual({
        id: userId,
        email: 'john@example.com',
        profile: { firstName: 'John', lastName: 'Doe' },
      });
    });

    it('includes file path in avatarUrl when file is uploaded', async () => {
      const userId = 'user_1';
      const body = { firstName: 'John' };
      const mockFile = { filename: 'avatar-123456.jpg' } as Express.Multer.File;

      service.update.mockResolvedValue({
        id: userId,
        password: 'hashed_password',
        profile: { firstName: 'John', avatarUrl: '/uploads/avatars/avatar-123456.jpg' },
      } as TUpdatedUser);

      await controller.updateProfile(userId, body, mockFile);

      expect(service.update).toHaveBeenCalledWith(userId, {
        firstName: 'John',
        avatarUrl: '/uploads/avatars/avatar-123456.jpg',
      });
    });
  });
});
