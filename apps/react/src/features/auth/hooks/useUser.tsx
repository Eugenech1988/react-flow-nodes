import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  avatarUrl?: string;
}

export const USER_QUERY_KEY = ['current-user'];

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
      } catch (err) {
        return null;
      }
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  const updateUserCache = (userData: User | null) => {
    queryClient.setQueryData(USER_QUERY_KEY, userData);
  };

  return {
    user: user ?? null,
    isAuth: !!user,
    isLoading,
    isError,
    error,
    updateUserCache,
  };
}