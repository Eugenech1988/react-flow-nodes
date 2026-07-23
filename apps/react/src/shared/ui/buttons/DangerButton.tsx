import { Trash2, Loader2, type LucideIcon } from 'lucide-react';
import { Button } from '@pipeline/ui';

interface DangerButtonProps {
  onClick: () => void;
  isPending?: boolean;
  text?: string;
  size?: 'xs' | 'sm';
  icon?: LucideIcon | null;
}

export const DangerButton = ({
                               onClick,
                               isPending = false,
                               text = 'Delete Account',
                               size = 'sm',
                               icon: Icon = Trash2,
                             }: DangerButtonProps) => {
  const textSizeClass = size === 'xs' ? 'text-xs' : 'text-sm';
  const iconSizeClass = size === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-4.5 ${textSizeClass} font-medium text-white bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:from-rose-700 active:to-rose-600 rounded-lg cursor-pointer shadow-xs transition-all shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-rose-500/20 disabled:opacity-50`}
    >
      {isPending ? (
        <Loader2 className={`${iconSizeClass} animate-spin text-white`} />
      ) : (
        <>
          {Icon && <Icon className={`${iconSizeClass} text-white`} />}
          <span>{text}</span>
        </>
      )}
    </Button>
  );
};