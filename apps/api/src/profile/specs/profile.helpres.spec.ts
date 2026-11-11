import { existsSync, mkdirSync } from 'node:fs';
import { AVATAR_UPLOAD_DIR, avatarDestination, avatarFilename } from '@/profile/profile.helpers';

jest.mock('node:fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

describe('profile helpers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('avatarDestination', () => {
    it('creates the upload directory when it does not exist', () => {
      (existsSync as jest.Mock).mockReturnValue(false);
      const callback = jest.fn();

      avatarDestination({} as Express.Request, {} as Express.Multer.File, callback);

      expect(mkdirSync).toHaveBeenCalledWith(AVATAR_UPLOAD_DIR, { recursive: true });
      expect(callback).toHaveBeenCalledWith(null, AVATAR_UPLOAD_DIR);
    });

    it('skips mkdir when directory already exists', () => {
      (existsSync as jest.Mock).mockReturnValue(true);
      const callback = jest.fn();

      avatarDestination({} as Express.Request, {} as Express.Multer.File, callback);

      expect(mkdirSync).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(null, AVATAR_UPLOAD_DIR);
    });
  });

  describe('avatarFilename', () => {
    it('builds a unique filename keeping the original extension', () => {
      const callback = jest.fn();
      const file = { originalname: 'avatar.jpg' } as Express.Multer.File;

      avatarFilename({} as Express.Request, file, callback);

      expect(callback).toHaveBeenCalledWith(null, expect.stringMatching(/^\d+-\d+\.jpg$/));
    });

    it('keeps empty extension when originalname has none', () => {
      const callback = jest.fn();
      const file = { originalname: 'avatar' } as Express.Multer.File;

      avatarFilename({} as Express.Request, file, callback);

      expect(callback).toHaveBeenCalledWith(null, expect.stringMatching(/^\d+-\d+$/));
    });
  });
});
