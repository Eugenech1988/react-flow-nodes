import { useUser } from '@/shared/hooks';
import { resolveAvatarUrl } from '@/shared/lib';

type TPlanLabel = 'Pro Plan' | 'Free Plan';

interface IUseProfileSidebarResult {
  displayName: string;
  jobTitle: string;
  initials: string;
  avatarUrl: string | null;
  isTwoFactorEnabled: boolean;
  isProActive: boolean;
  planLabel: TPlanLabel;
}

export const useProfileSidebar = (): IUseProfileSidebarResult => {
  const { user, isProActive } = useUser();

  const firstName = user?.profile?.firstName?.trim() ?? '';
  const lastName = user?.profile?.lastName?.trim() ?? '';
  const nickname = user?.profile?.nickName ?? user?.email?.split('@')[0] ?? '';
  const jobTitle = user?.profile?.jobTitle ?? '';

  const displayName =
    firstName || lastName ? `${firstName} ${lastName}`.trim() : nickname || 'User';

  let initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  if (!initials && nickname) {
    initials = nickname.slice(0, 2).toUpperCase();
  }
  if (!initials) {
    initials = 'U';
  }

  const avatarUrl = resolveAvatarUrl(user?.profile?.avatarUrl);

  const planLabel: TPlanLabel = isProActive ? 'Pro Plan' : 'Free Plan';

  return {
    displayName,
    jobTitle,
    initials,
    avatarUrl,
    isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
    isProActive,
    planLabel,
  };
};
