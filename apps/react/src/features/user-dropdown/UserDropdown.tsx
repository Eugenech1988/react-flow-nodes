import { Link } from 'react-router-dom';
import { useLogout, useUser } from '@/shared/hooks';
import { LogOut, User, Settings, CreditCard, ChevronDown, Zap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@pipeline/ui';

const BASE_URL = import.meta.env.VITE_API_URL;

export const UserDropdown = () => {
  const { user, role } = useUser();
  const { logout } = useLogout();

  const isContentManager = role === 'CONTENT_MANAGER';
  const isFreePlan = user?.subscription && user?.subscription.plan === 'FREE';

  const firstName = user?.profile?.firstName || '';
  const lastName = user?.profile?.lastName || '';
  const email = user?.email || '';

  const initials =
    firstName && lastName
      ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      : firstName
        ? firstName.substring(0, 2).toUpperCase()
        : email.substring(0, 2).toUpperCase();

  const fullName =
    firstName || lastName
      ? `${firstName} ${lastName}`.trim()
      : user?.profile?.nickName || email.split('@')[0];

  const avatarUrl = user?.profile?.avatarUrl;
  const displaySrc = avatarUrl
    ? avatarUrl.startsWith('http') || avatarUrl.startsWith('blob:')
      ? avatarUrl
      : `${BASE_URL}${avatarUrl}`
    : null;

  const itemClasses = [
    'flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg cursor-pointer transition-colors font-medium',
    'text-foreground [&>svg]:text-muted-foreground',
    'hover:bg-teal-500/10! focus:bg-teal-500/10! data-[highlighted]:bg-teal-500/10!',
    'hover:text-teal-600! focus:text-teal-600! data-[highlighted]:text-teal-600!',
    'dark:hover:text-teal-400! dark:focus:text-teal-400! dark:data-[highlighted]:text-teal-400!',
    '[&>svg]:transition-colors',
    'hover:[&>svg]:text-teal-600! focus:[&>svg]:text-teal-600! data-[highlighted]:[&>svg]:text-teal-600!',
    'dark:hover:[&>svg]:text-teal-400! dark:focus:[&>svg]:text-teal-400! dark:data-[highlighted]:[&>svg]:text-teal-400!',
  ].join(' ');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-muted/80 hover:border-border/60 group flex cursor-pointer items-center gap-1.5 rounded-full border border-transparent p-1 transition-all outline-none select-none">
        {displaySrc ? (
          <img
            src={displaySrc}
            alt={fullName}
            className="h-6 w-6 rounded-full border border-teal-500/20 object-cover shadow-xs"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-teal-700 text-[10px] font-bold text-white shadow-xs">
            {initials}
          </div>
        )}
        <ChevronDown className="text-muted-foreground group-hover:text-foreground h-3.5 w-3.5 transition-colors duration-200" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="align-end border-border/80 bg-card/95 w-56 rounded-xl border p-1.5 shadow-lg backdrop-blur-md"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 font-normal">
            <div className="flex flex-col space-y-0.5">
              <p className="text-foreground text-sm leading-none font-medium">{fullName}</p>
              <p className="text-muted-foreground text-xs leading-none">{email}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-border/60 my-1" />

          <DropdownMenuItem render={<Link to="/settings/profile" />} className={itemClasses}>
            <User className="h-4 w-4 shrink-0" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem render={<Link to="/settings/account" />} className={itemClasses}>
            <Settings className="h-4 w-4 shrink-0" />
            <span>Account Settings</span>
          </DropdownMenuItem>

          {/* 👇 Скрываем ссылку на биллинг для контент-менеджера */}
          {!isContentManager && (
            <DropdownMenuItem render={<Link to="/settings/billing" />} className={itemClasses}>
              <CreditCard className="h-4 w-4 shrink-0" />
              <span>Billing</span>
            </DropdownMenuItem>
          )}

          {!isContentManager && isFreePlan && (
            <>
              <DropdownMenuSeparator className="bg-border/60 my-1" />

              <DropdownMenuItem
                render={<Link to="/settings/billing" />}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-teal-600! transition-colors hover:bg-teal-500/20! hover:text-teal-500! focus:bg-teal-500/20! focus:text-teal-500! data-[highlighted]:bg-teal-500/20! data-[highlighted]:text-teal-500! dark:text-teal-300! dark:hover:text-teal-200! dark:focus:text-teal-200! dark:data-[highlighted]:text-teal-200!"
              >
                <Zap className="h-4 w-4 shrink-0 fill-current text-current" />
                <span>Activate Pro Plan</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="bg-border/60 my-1" />

          <DropdownMenuItem
            onClick={() => logout()}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-rose-600! transition-colors hover:bg-rose-500/10! hover:text-rose-500! focus:bg-rose-500/10! focus:text-rose-500! data-[highlighted]:bg-rose-500/10! data-[highlighted]:text-rose-500! dark:text-rose-400! dark:hover:text-rose-300! dark:focus:text-rose-300! dark:data-[highlighted]:text-rose-300!"
          >
            <LogOut className="h-4 w-4 shrink-0 text-current" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
