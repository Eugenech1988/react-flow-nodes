import { extname } from 'node:path';
import { TUploadCallback } from '@/pipelines/types';

export const screenshotFilename = (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: TUploadCallback,
): void => {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const ext = extname(file.originalname);
  callback(null, `${uniqueSuffix}${ext}`);
};
