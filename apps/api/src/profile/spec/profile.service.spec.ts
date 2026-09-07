import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ProfileService } from '@/profile/profile.service';
import { PrismaService } from '@/prisma/prisma.service';
import * as fs from 'node:fs';

jest.mock('node:fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: any;

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { firstName: 'John' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update profile with plain text data successfully', async () => {
      const mockUser = {
        id: 'user_1',
        email: 'john@example.com',
        profile: { avatarUrl: '/old-avatar.png' },
      };

      const input = {
        firstName: 'John',
        lastName: 'Doe',
        company: 'ACME',
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue({
        id: 'user_1',
        email: 'john@example.com',
        profile: { ...input, avatarUrl: '/old-avatar.png' },
      });

      const result = await service.update('user_1', input);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user_1' },
        data: expect.objectContaining({
          profile: expect.objectContaining({
            upsert: expect.objectContaining({
              update: expect.objectContaining({
                firstName: 'John',
                lastName: 'Doe',
              }),
            }),
          }),
        }),
        include: { profile: true },
      });
      expect(result?.profile?.firstName).toBe('John');
    });

    it('should process base64 avatarUrl and save file to disk', async () => {
      const mockUser = {
        id: 'user_1',
        email: 'john@example.com',
        profile: null,
      };

      const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const input = {
        firstName: 'John',
        avatarUrl: base64Image,
      };

      (fs.existsSync as jest.Mock).mockReturnValue(false);
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue({
        id: 'user_1',
        profile: { firstName: 'John', avatarUrl: '/uploads/avatars/123.png' },
      });

      await service.update('user_1', input);

      expect(fs.mkdirSync).toHaveBeenCalledWith('./uploads/avatars', { recursive: true });
      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when prisma update fails', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user_1', email: 'test@example.com' });
      prisma.user.update.mockRejectedValue(new Error('Database error'));

      await expect(
        service.update('user_1', { firstName: 'John' }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});