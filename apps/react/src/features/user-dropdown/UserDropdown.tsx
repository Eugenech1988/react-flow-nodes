import { useNavigate } from 'react-router-dom';
import { useLogout, useSubscription, useUser } from '@/shared/hooks';
import {
  LogOut,
  User,
  Settings,
  CreditCard,
  ChevronDown,
  Zap
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from '@pipeline/ui';

const BASE_URL = import.meta.env.API_URL || 'http://localhost:3000';

export const UserDropdown = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { subscription } = useSubscription();
  const { logout } = useLogout();

  const isFreePlan = subscription && subscription.plan === 'FREE';

  const firstName = user?.profile?.firstName || '';
  const lastName = user?.profile?.lastName || '';
  const email = user?.email || '';

  const initials = (firstName && lastName)
    ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    : firstName
      ? firstName.substring(0, 2).toUpperCase()
      : email.substring(0, 2).toUpperCase();

  const fullName = (firstName || lastName)
    ? `${firstName} ${lastName}`.trim()
    : user?.profile?.nickName || email.split('@')[0];

  const avatarUrl = user?.profile?.avatarUrl;
  const displaySrc = avatarUrl
    ? (avatarUrl.startsWith('http') || avatarUrl.startsWith('blob:'))
      ? avatarUrl
      : `${BASE_URL}${avatarUrl}`
    : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-1.5 p-1 hover:bg-muted/80 border border-transparent hover:border-border/60 rounded-full cursor-pointer transition-all outline-none select-none group"
      >
        {displaySrc ? (
          <img
            src={displaySrc}
            alt={fullName}
            className="w-6 h-6 rounded-full object-cover shadow-xs border border-teal-500/20"
          />
        ) : (
          <div
            className="flex items-center justify-center w-6 h-6 rounded-full bg-linear-to-br from-teal-500 to-teal-700 text-[10px] font-bold text-white shadow-xs"
          >
            {initials}
          </div>
        )}
        <ChevronDown
          className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors duration-200"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 align-end p-1.5 border border-border/80 bg-card/95 shadow-lg rounded-xl backdrop-blur-md"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 font-normal">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium leading-none text-foreground">{fullName}</p>
              <p className="text-xs leading-none text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1 bg-border/60" />

          <DropdownMenuItem
            onClick={() => navigate('/settings/profile')}
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg cursor-pointer transition-colors"
          >
            <User className="w-4 h-4 text-muted-foreground" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate('/settings/account')}
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg cursor-pointer transition-colors"
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span>Account Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate('/settings/billing')}
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg cursor-pointer transition-colors"
          >
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span>Billing</span>
          </DropdownMenuItem>

          {isFreePlan && (
            <>
              <DropdownMenuSeparator className="my-1 bg-border/60" />

              <DropdownMenuItem
                onClick={() => navigate('/settings/billing')}
                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg cursor-pointer font-semibold transition-colors hover:bg-teal-500/20 focus:bg-teal-500/20 data-[highlighted]:bg-teal-500/20 text-teal-600 hover:text-teal-500 focus:text-teal-500 data-[highlighted]:text-teal-500 dark:text-teal-300 dark:hover:text-teal-200 dark:focus:text-teal-200 dark:data-[highlighted]:text-teal-200"
              >
                <Zap className="w-4 h-4 fill-current text-current shrink-0" />
                <span>Activate Pro Plan</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="my-1 bg-border/60" />

          <DropdownMenuItem
            onClick={() => logout()}
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg cursor-pointer transition-colors font-medium text-rose-600! dark:text-rose-400! hover:text-rose-500! focus:text-rose-500! data-[highlighted]:text-rose-500! dark:hover:text-rose-300! dark:focus:text-rose-300! dark:data-[highlighted]:text-rose-300! hover:bg-rose-500/10 focus:bg-rose-500/10 data-[highlighted]:bg-rose-500/10"
          >
            <LogOut className="w-4 h-4 text-current shrink-0" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};