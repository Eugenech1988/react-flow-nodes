import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockUsersService = {
      register: jest.fn(),
      findAll: jest.fn(),
      updatePassword: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.register', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const expectedUser = { id: '1', ...dto };
      service.register.mockResolvedValue(expectedUser as any);

      const result = await controller.create(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findAll', () => {
    it('should return list of users', async () => {
      const usersList = [{ id: '1' }, { id: '2' }];
      service.findAll.mockResolvedValue(usersList as any);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(usersList);
    });
  });

  describe('updatePassword', () => {
    it('should update user password and return success true', async () => {
      const req = { user: { id: 'user_1' } } as any;
      const dto = { currentPassword: 'old', newPassword: 'new' };

      service.updatePassword.mockResolvedValue({ success: true });

      const result = await controller.updatePassword(req, dto);

      expect(service.updatePassword).toHaveBeenCalledWith('user_1', dto);
      expect(result).toEqual({ success: true });
    });
  });

  describe('deleteAccount', () => {
    it('should throw BadRequestException if user ID is missing from request', async () => {
      const req = { user: {} } as any;

      await expect(controller.deleteAccount(req)).rejects.toThrow(BadRequestException);
    });

    it('should delete account and return success true', async () => {
      const req = { user: { id: 'user_1' } } as any;
      service.delete.mockResolvedValue();

      const result = await controller.deleteAccount(req);

      expect(service.delete).toHaveBeenCalledWith('user_1');
      expect(result).toEqual({ success: true });
    });
  });
});