import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { USER_QUERY_KEY } from '@/shared';

export interface Profile {
  id: string;
  nickName: string;
  firstName: string;
  lastName?: string | null;
  avatarUrl: string | null;
  company?: string | null;
  location?: string | null;
  jobTitle?: string | null;
  createdAt: string;
  updatedAt: string;
  plan?: string;
  planExpiresAt?: string;

}

export interface User {
  id: string;
  email: string;
  provider: 'google' | 'github' | 'local';
  providerId: string;
  createdAt: string;
  updatedAt: string;
  profile: Profile | null;
  isTwoFactorEnabled?: boolean;
  twoFactorSecret?: string;
}


export function useUser() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<User | null, Error>({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        return await api.get<User>('/auth/me');
      } catch (err: any) {
        if (err.message === 'Unauthorized') {
          return null;
        }
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error.message === 'Unauthorized') return false;
      return failureCount < 2;
    },
  });

  const updateUserCache = (userData: User | null) => {
    queryClient.setQueryData(USER_QUERY_KEY, userData);
  };

  const clearUserCache = () => {
    queryClient.setQueryData(USER_QUERY_KEY, null);
    queryClient.invalidateQueries();
  };

  return {
    user: user ?? null,
    isAuth: !!user,
    isLoading,
    isError,
    error,
    updateUserCache,
    clearUserCache,
  };
}