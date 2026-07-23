import { Save, Loader2, type LucideIcon } from 'lucide-react';
import { Button } from '@pipeline/ui';
import { cn } from '@/shared/lib';

interface SubmitButtonProps {
  isPending: boolean;
  isDisabled?: boolean;
  text?: string;
  pendingText?: string;
  icon?: LucideIcon | null;
  onClick?: () => void;
  className?: string;
}

export const SubmitButton = ({
                               isPending,
                               isDisabled = false,
                               text = 'Change Password',
                               pendingText = 'Saving...',
                               icon: Icon = Save,
                               onClick,
                               className
                             }: SubmitButtonProps) => (
  <Button
    type="submit"
    disabled={isDisabled || isPending}
    onClick={onClick}
    className={cn("flex items-center gap-2 px-4 py-4.5 text-sm font-medium text-white bg-linear-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 active:from-teal-800 active:to-teal-700 cursor-pointer shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-teal-500/20 disabled:opacity-50 disabled:pointer-events-none rounded-xl",
      className
    )}
  >
    {isPending ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin text-white" />
        <span>{pendingText}</span>
      </>
    ) : (
      <>
        {Icon && <Icon className="w-4 h-4" />}
        <span>{text}</span>
      </>
    )}
  </Button>
);