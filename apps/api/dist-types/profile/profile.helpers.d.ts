export type TUploadDestinationCallback = (error: Error | null, destination: string) => void;
export type TUploadFilenameCallback = (error: Error | null, filename: string) => void;
export declare const AVATAR_UPLOAD_DIR = './uploads/avatars';
export declare const ensureAvatarDir: () => void;
export declare const avatarDestination: (
  _req: Express.Request,
  _file: Express.Multer.File,
  callback: TUploadDestinationCallback,
) => void;
export declare const avatarFilename: (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: TUploadFilenameCallback,
) => void;
