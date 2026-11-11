import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';
import type { TUserSafe } from '@/users/types';
import type { Request } from 'express';

type TCreated = Awaited<ReturnType<UsersService['register']>>;
type TListed = Awaited<ReturnType<UsersService['findAll']>>;
type TMockUsersService = jest.Mocked<
  Pick<UsersService, 'register' | 'findAll' | 'updatePassword' | 'delete'>
>;

interface IRequestWithUser extends Request {
  user: TUserSafe;
}

const createMockUsersService = (): TMockUsersService => ({
  register: jest.fn(),
  findAll: jest.fn(),
  updatePassword: jest.fn(),
  delete: jest.fn(),
});

const createRequestWithUser = (user: Partial<TUserSafe>): IRequestWithUser =>
  ({ user }) as unknown as IRequestWithUser;

describe('UsersController', () => {
  let controller: UsersController;
  let service: TMockUsersService;

  beforeEach(async () => {
    service = createMockUsersService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: service }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('delegates to register', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const expected = { id: '1', ...dto } as TCreated;
      service.register.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('returns list of users', async () => {
      const list = [{ id: '1' }, { id: '2' }] as TListed;
      service.findAll.mockResolvedValue(list);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(list);
    });
  });

  describe('updatePassword', () => {
    it('delegates to updatePassword and returns success', async () => {
      const req = createRequestWithUser({ id: 'user_1' });
      const dto = { currentPassword: 'old', newPassword: 'new' };

      service.updatePassword.mockResolvedValue({ success: true });

      const result = await controller.updatePassword(req, dto);

      expect(service.updatePassword).toHaveBeenCalledWith('user_1', dto);
      expect(result).toEqual({ success: true });
    });
  });

  describe('deleteAccount', () => {
    it('throws BadRequestException if user ID is missing', async () => {
      const req = createRequestWithUser({});

      await expect(controller.deleteAccount(req)).rejects.toThrow(BadRequestException);
    });

    it('delegates to delete and returns success', async () => {
      const req = createRequestWithUser({ id: 'user_1' });
      service.delete.mockResolvedValue(undefined);

      const result = await controller.deleteAccount(req);

      expect(service.delete).toHaveBeenCalledWith('user_1');
      expect(result).toEqual({ success: true });
    });
  });
});
