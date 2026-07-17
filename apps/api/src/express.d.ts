import { IGoogleUser } from './auth/interfaces/google-user.interface';

declare global {
  namespace Express {
    interface User extends IGoogleUser {}
  }
}