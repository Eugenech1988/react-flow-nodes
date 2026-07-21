import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { USER_QUERY_KEY } from '@/shared/lib';
import type { IUser } from '@/shared/lib';


export function useUser() {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<IUser | null, Error>({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        return await api.get<IUser>('/auth/me');
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

  return {
    user: user ?? null,
    isAuth: !!user,
    isLoading,
    isError,
    error,
  };
}