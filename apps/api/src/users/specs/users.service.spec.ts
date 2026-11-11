import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  verify: jest.fn().mockResolvedValue(true),
}));

type TMockPrisma = {
  user: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  profile: {
    findFirst: jest.Mock;
    deleteMany: jest.Mock;
  };
  subscription: {
    findUnique: jest.Mock;
    create: jest.Mock;
    deleteMany: jest.Mock;
  };
  transaction: {
    deleteMany: jest.Mock;
  };
  $transaction: jest.Mock;
};

const createMockPrisma = (): TMockPrisma => {
  const prisma: TMockPrisma = {
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
    $transaction: jest.fn(),
  };

  prisma.$transaction.mockImplementation((cb: (tx: TMockPrisma) => unknown) => cb(prisma));

  return prisma;
};

const userRelationsInclude = { profile: true, subscription: true, currentPipeline: true };

describe('UsersService', () => {
  let service: UsersService;
  let prisma: TMockPrisma;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns array of users', async () => {
      const users = [{ id: '1', email: 'test@example.com' }];
      prisma.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('throws InternalServerErrorException on DB error', async () => {
      prisma.user.findMany.mockRejectedValue(new Error('DB Error'));

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('delegates to prisma.user.update with includes', async () => {
      const updated = { id: 'user_1', email: 'test@example.com' };
      prisma.user.update.mockResolvedValue(updated);

      const result = await service.update('user_1', { role: 'USER' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user_1' },
        data: { role: 'USER' },
        include: { profile: true, subscription: true, currentPipeline: true },
      });
      expect(result).toEqual(updated);
    });

    it('wraps DB errors in InternalServerErrorException', async () => {
      prisma.user.update.mockRejectedValue(new Error('DB'));

      await expect(service.update('user_1', { role: 'USER' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('register', () => {
    it('throws ConflictException if email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });

      await expect(
        service.register({ email: 'test@example.com', password: 'password123' }),
      ).rejects.toThrow(ConflictException);
    });

    it('uses provided nickName without modification', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'user_1', email: 'new@example.com' });
      prisma.profile.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 'user_1', email: 'new@example.com' });

      await service.register({
        email: 'new@example.com',
        password: 'password123',
        nickName: 'custom_nick',
      });

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            profile: {
              create: expect.objectContaining({ nickName: 'custom_nick' }),
            },
          }),
        }),
      );
    });

    it('registers a local user and hashes password', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'user_1', email: 'new@example.com' });
      prisma.profile.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 'user_1', email: 'new@example.com' });

      const result = await service.register({
        email: 'new@example.com',
        password: 'password123',
        firstName: 'John',
      });

      expect(argon2.hash).toHaveBeenCalledWith('password123');
      expect(result).toBeDefined();
    });

    it('registers an OAuth user without hashing a password', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'user_1', email: 'oauth@example.com' });
      prisma.profile.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 'user_1', email: 'oauth@example.com' });

      await service.register({
        email: 'oauth@example.com',
        password: 'ignored',
        provider: 'google',
        providerId: 'google_123',
      });

      expect(argon2.hash).not.toHaveBeenCalled();
    });

    it('appends suffix when generated nickname already exists', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'user_1', email: 'new@example.com' });
      prisma.profile.findFirst.mockResolvedValue({ id: 'p1' });
      prisma.user.create.mockResolvedValue({ id: 'user_1', email: 'new@example.com' });

      await service.register({ email: 'new@example.com', password: 'password123' });

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            profile: expect.objectContaining({
              create: expect.objectContaining({
                nickName: expect.stringMatching(/^new_.+_[a-z0-9]+$/),
              }),
            }),
          }),
        }),
      );
    });
  });

  describe('findOneByEmail', () => {
    it('throws InternalServerErrorException on DB error', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error('DB'));

      await expect(service.findOneByEmail('x@y.z')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOneByProvider', () => {
    it('returns user when found', async () => {
      const mock = { id: 'user_1' };
      prisma.user.findFirst.mockResolvedValue(mock);

      const result = await service.findOneByProvider('google', 'google_123');

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { provider: 'google', providerId: 'google_123' },
        include: userRelationsInclude,
      });
      expect(result).toEqual(mock);
    });

    it('throws InternalServerErrorException on DB error', async () => {
      prisma.user.findFirst.mockRejectedValue(new Error('DB'));

      await expect(service.findOneByProvider('google', 'g1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOneById', () => {
    it('returns user when found', async () => {
      const mock = { id: 'user_1' };
      prisma.user.findUnique.mockResolvedValue(mock);

      const result = await service.findOneById('user_1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user_1' },
        include: userRelationsInclude,
      });
      expect(result).toEqual(mock);
    });

    it('throws InternalServerErrorException on DB error', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error('DB'));

      await expect(service.findOneById('user_1')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('create', () => {
    const createData = {
      email: 'a@b.c',
      profile: { create: { nickName: 'nick', firstName: 'A' } },
    } as Prisma.UserCreateInput;

    it('creates user and ensures a subscription', async () => {
      prisma.user.create.mockResolvedValue({ id: 'user_1' });
      prisma.subscription.findUnique.mockResolvedValue(null);
      prisma.subscription.create.mockResolvedValue({ id: 'sub_1' });
      prisma.user.findUnique.mockResolvedValue({ id: 'user_1' });

      const result = await service.create(createData);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: createData,
        include: { profile: true, subscription: true, currentPipeline: true },
      });
      expect(prisma.subscription.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ userId: 'user_1', plan: 'FREE', planStatus: 'ACTIVE' }),
      });
      expect(result).toEqual({ id: 'user_1' });
    });

    it('skips subscription creation when one already exists', async () => {
      prisma.user.create.mockResolvedValue({ id: 'user_1' });
      prisma.subscription.findUnique.mockResolvedValue({ id: 'sub_1' });
      prisma.user.findUnique.mockResolvedValue({ id: 'user_1' });

      await service.create(createData);

      expect(prisma.subscription.create).not.toHaveBeenCalled();
    });

    it('wraps DB errors in InternalServerErrorException', async () => {
      prisma.user.create.mockRejectedValue(new Error('DB'));

      await expect(service.create(createData)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updatePassword', () => {
    it('throws BadRequestException if user is missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updatePassword('user_1', { newPassword: 'newPassword123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when currentPassword is missing for password user', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user_1', hasPassword: true });

      await expect(
        service.updatePassword('user_1', { newPassword: 'newPassword123' }),
      ).rejects.toThrow('Current password is required');
    });

    it('throws BadRequestException when hasPassword is true but hash is null', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user_1',
        hasPassword: true,
        password: null,
      });

      await expect(
        service.updatePassword('user_1', {
          currentPassword: 'old',
          newPassword: 'newPassword123',
        }),
      ).rejects.toThrow('Local authentication password is missing');
    });

    it('throws BadRequestException when currentPassword does not match', async () => {
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

    it('updates password successfully', async () => {
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
        data: { password: 'hashed_password', hasPassword: true },
      });
      expect(result).toEqual({ success: true });
    });

    it('throws InternalServerErrorException when update fails', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user_1', hasPassword: false });
      prisma.user.update.mockRejectedValue(new Error('DB'));

      await expect(
        service.updatePassword('user_1', { newPassword: 'newPassword123' }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('delete', () => {
    it('throws BadRequestException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.delete('user_1')).rejects.toThrow(BadRequestException);
    });

    it('deletes user and related data in a transaction', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user_1' });

      await service.delete('user_1');

      expect(prisma.transaction.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user_1' } });
      expect(prisma.profile.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user_1' } });
      expect(prisma.subscription.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user_1' } });
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'user_1' } });
    });

    it('throws InternalServerErrorException when transaction fails', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user_1' });
      prisma.user.delete.mockRejectedValue(new Error('DB'));

      await expect(service.delete('user_1')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('setCurrentPipeline', () => {
    it('updates user currentPipelineId', async () => {
      const updated = { id: 'user_1', currentPipelineId: 'pipe_1' };
      prisma.user.update.mockResolvedValue(updated);

      const result = await service.setCurrentPipeline('user_1', 'pipe_1');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user_1' },
        data: { currentPipelineId: 'pipe_1' },
        include: userRelationsInclude,
      });
      expect(result).toEqual(updated);
    });

    it('throws InternalServerErrorException on DB error', async () => {
      prisma.user.update.mockRejectedValue(new Error('DB'));

      await expect(service.setCurrentPipeline('user_1', 'pipe_1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
