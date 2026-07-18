export interface IGithubUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken?: string;
  providerId: string;
  provider: 'github';
}