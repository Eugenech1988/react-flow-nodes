import { diskStorage } from 'multer';
import { mkdirSync } from 'node:fs';
import { extname } from 'node:path';
import type { StorageEngine } from 'multer';

export const createApplicationsStorage = (): StorageEngine => {
  return diskStorage({
    destination: (req, file, cb) => {
      const jobId = (req.body as { jobId?: string }).jobId || 'unknown';
      const type = file.fieldname === 'resume' ? 'cvs' : 'covers';
      const path = `./uploads/applications/${jobId}/${type}`;

      try {
        mkdirSync(path, { recursive: true });
        cb(null, path);
      } catch (error) {
        cb(error as Error, path);
      }
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
};
