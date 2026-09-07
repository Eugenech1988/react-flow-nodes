import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { PrismaService } from '@/prisma/prisma.service';
import * as argon2 from 'argon2';

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  verify: jest.fn().mockResolvedValue(true),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const mockPrisma = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      profile: {
        findFirst: jest.fn(),
        deleteMany: jest.fn(),
      },
      subscription: {
        findUnique: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn(),
      },
      transaction: {
        deleteMany: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(mockPrisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const usersMock = [{ id: '1', email: 'test@example.com' }];
      prisma.user.findMany.mockResolvedValue(usersMock);

      const result = await service.findAll();

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(usersMock);
    });

    it('should throw InternalServerErrorException on database failure', async () => {
      prisma.user.findMany.mockRejectedValue(new Error('DB Error'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('register', () => {
    it('should throw ConflictException if user email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });

      await expect(
        service.register({ email: 'test@example.com', password: 'password123' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should successfully register a local user and hash password', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(null) // existingUser check
        .mockResolvedValueOnce({ id: 'user_1', email: 'new@example.com' }); // return after create transaction

      prisma.profile.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 'user_1', email: 'new@example.com' });

      const dto = { email: 'new@example.com', password: 'password123', firstName: 'John' };
      const result = await service.register(dto);

      expect(argon2.hash).toHaveBeenCalledWith('password123');
      expect(result).toBeDefined();
    });
  });

  describe('updatePassword', () => {
    it('should throw BadRequestException if user is missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updatePassword('user_1', { newPassword: 'newPassword123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if currentPassword is missing for user with password', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user_1', hasPassword: true });

      await expect(
        service.updatePassword('user_1', { newPassword: 'newPassword123' }),
      ).rejects.toThrow('Current password is required');
    });

    it('should throw BadRequestException if currentPassword does not match', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user_1',
        hasPassword: true,
        password: 'hashed_old_pass',
      });
      (argon2.verify as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        service.updatePassword('user_1', {
          currentPassword: 'wrong_pass',
          newPassword: 'newPassword123',
        }),
      ).rejects.toThrow('Invalid old password');
    });

    it('should update password successfully', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user_1',
        hasPassword: true,
        password: 'hashed_old_pass',
      });
      (argon2.verify as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.updatePassword('user_1', {
        currentPassword: 'correct_pass',
        newPassword: 'newPassword123',
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user_1' },
        data: {
          password: 'hashed_password',
          hasPassword: true,
        },
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe('delete', () => {
    it('should throw BadRequestException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.delete('user_1')).rejects.toThrow(BadRequestException);
    });

    it('should delete user and related data in a transaction', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user_1' });

      await service.delete('user_1');

      expect(prisma.transaction.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user_1' } });
      expect(prisma.profile.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user_1' } });
      expect(prisma.subscription.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user_1' } });
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'user_1' } });
    });
  });
});