import { mkdirSync } from 'node:fs';
import { createApplicationsStorage } from '../multer.config';

jest.mock('node:fs', () => ({
  mkdirSync: jest.fn(),
}));

type DiskStorage = {
  getDestination: (
    req: unknown,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => void;
  getFilename: (
    req: unknown,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => void;
};

describe('createApplicationsStorage', () => {
  let storage: DiskStorage;
  let file: Express.Multer.File;
  let req: { body: { jobId?: string } };
  let cb: jest.Mock;

  beforeEach(() => {
    storage = createApplicationsStorage() as unknown as DiskStorage;
    cb = jest.fn();
    file = {
      fieldname: 'resume',
      originalname: 'resume.pdf',
    } as Express.Multer.File;
    req = { body: { jobId: 'job_123' } };
    jest.clearAllMocks();
  });

  describe('getDestination', () => {
    it('should create directory and call cb with path', () => {
      storage.getDestination(req, file, (_err, path) => {
        expect(path).toBe('./uploads/applications/job_123/cvs');
        expect(mkdirSync).toHaveBeenCalledWith('./uploads/applications/job_123/cvs', {
          recursive: true,
        });
      });
    });

    it('should call cb with error if mkdirSync throws', () => {
      (mkdirSync as jest.Mock).mockImplementationOnce(() => {
        throw new Error('EACCES');
      });

      storage.getDestination(req, file, (err) => {
        expect(err).toBeInstanceOf(Error);
        expect((err as Error).message).toBe('EACCES');
      });
    });

    it('should use "covers" folder for non-resume files', () => {
      const coverFile = { ...file, fieldname: 'coverLetterFile' } as Express.Multer.File;

      storage.getDestination(req, coverFile, (_err, path) => {
        expect(path).toBe('./uploads/applications/job_123/covers');
      });
    });

    it('should use "unknown" folder when jobId is missing', () => {
      storage.getDestination({ body: {} }, file, (_err, path) => {
        expect(path).toBe('./uploads/applications/unknown/cvs');
      });
    });
  });

  describe('getFilename', () => {
    it('should generate unique filename with original extension', () => {
      storage.getFilename(req, file, (err, name) => {
        expect(err).toBeNull();
        expect(name).toMatch(/^resume-\d+-\d+\.pdf$/);
      });
    });
  });
});
