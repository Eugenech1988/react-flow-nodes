import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from '@/profile/profile.controller';
import { ProfileService } from '@/profile/profile.service';
import { updateProfileInputSchema } from '@pipeline/contracts';

jest.mock('@pipeline/contracts', () => ({
  updateProfileInputSchema: {
    parse: jest.fn((data) => data),
  },
}));

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: jest.Mocked<ProfileService>;

  beforeEach(async () => {
    const mockProfileService = {
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateProfile', () => {
    it('should validate body and return safe user object without password', async () => {
      const userId = 'user_1';
      const body = { firstName: 'John', lastName: 'Doe' };
      const updatedUserWithPassword = {
        id: userId,
        email: 'john@example.com',
        password: 'hashed_password_secret',
        profile: { firstName: 'John', lastName: 'Doe' },
      };

      service.update.mockResolvedValue(updatedUserWithPassword as any);

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

    it('should include file path in avatarUrl if file is uploaded', async () => {
      const userId = 'user_1';
      const body = { firstName: 'John' };
      const mockFile = {
        filename: 'avatar-123456.jpg',
      } as Express.Multer.File;

      service.update.mockResolvedValue({
        id: userId,
        password: 'hashed_password',
        profile: { firstName: 'John', avatarUrl: '/uploads/avatars/avatar-123456.jpg' },
      } as any);

      await controller.updateProfile(userId, body, mockFile);

      expect(service.update).toHaveBeenCalledWith(userId, {
        firstName: 'John',
        avatarUrl: '/uploads/avatars/avatar-123456.jpg',
      });
    });
  });
});