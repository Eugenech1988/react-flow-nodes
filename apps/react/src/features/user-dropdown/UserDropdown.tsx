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
        className="flex items-center gap-1.5 p-1 hover:bg-foreground/4 active:bg-foreground/8 border border-transparent hover:border-border/60 rounded-full cursor-pointer transition-all outline-hidden select-none group">
        {displaySrc ? (
          <img
            src={displaySrc}
            alt={fullName}
            className="w-6 h-6 rounded-full object-cover shadow-xs"
          />
        ) : (
          <div
            className="flex items-center justify-center w-6 h-6 rounded-full bg-linear-to-br from-teal-400 to-emerald-500 text-[10px] font-bold text-white shadow-xs">
            {initials}
          </div>
        )}
        <ChevronDown
          className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors duration-200"/>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 align-end p-1.5 border border-border bg-card shadow-md rounded-xl"
                           align="end" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 font-normal">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium leading-none text-foreground">{fullName}</p>
              <p className="text-xs leading-none text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1 bg-border/60"/>

          <DropdownMenuItem
            onClick={() => navigate('/settings/profile')}
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer text-foreground/90 hover:bg-foreground/4 focus:bg-foreground/4 outline-hidden transition-colors"
          >
            <User className="w-4 h-4 text-muted-foreground"/>
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate('/settings/account')}
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer text-foreground/90 hover:bg-foreground/4 focus:bg-foreground/4 outline-hidden transition-colors"
          >
            <Settings className="w-4 h-4 text-muted-foreground"/>
            <span>Account Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate('/settings/billing')}
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer text-foreground/90 hover:bg-foreground/4 focus:bg-foreground/4 outline-hidden transition-colors"
          >
            <CreditCard className="w-4 h-4 text-muted-foreground"/>
            <span>Billing</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 bg-border/60"/>

          {isFreePlan &&
          <DropdownMenuItem
            onClick={() => navigate('/settings/billing')}
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer text-foreground/90 hover:bg-foreground/4 focus:bg-foreground/4 outline-hidden transition-colors"
          >
            <Zap className="w-4 h-4 text-emerald-500! fill-emerald-500 shrink-0" />
            <span className={`font-medium ${isFreePlan ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-foreground'}`}>
              Activate Pro Plan
            </span>
          </DropdownMenuItem>
          }

          <DropdownMenuItem
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer text-destructive hover:bg-destructive/8 focus:bg-destructive/8 outline-hidden transition-colors"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4"/>
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};