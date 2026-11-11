import { existsSync, mkdirSync } from 'node:fs';
import { extname } from 'node:path';

export type TUploadDestinationCallback = (error: Error | null, destination: string) => void;
export type TUploadFilenameCallback = (error: Error | null, filename: string) => void;

export const AVATAR_UPLOAD_DIR = './uploads/avatars';

export const ensureAvatarDir = (): void => {
  if (!existsSync(AVATAR_UPLOAD_DIR)) {
    mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
  }
};

export const avatarDestination = (
  _req: Express.Request,
  _file: Express.Multer.File,
  callback: TUploadDestinationCallback,
): void => {
  ensureAvatarDir();
  callback(null, AVATAR_UPLOAD_DIR);
};

export const avatarFilename = (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: TUploadFilenameCallback,
): void => {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const ext = extname(file.originalname);
  callback(null, `${uniqueSuffix}${ext}`);
};
