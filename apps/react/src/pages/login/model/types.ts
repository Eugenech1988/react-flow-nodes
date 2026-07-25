export type FormMode = 'login' | 'register';

export interface LoginResponseData {
  isTwoFactorRequired?: boolean;
  tempToken?: string;
  qrCodeImage?: string;
  secret?: string;
}