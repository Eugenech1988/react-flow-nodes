import { Save, Loader2, type LucideIcon } from 'lucide-react';
import { Button } from '@pipeline/ui'; // Base UI Button
import { cn } from '@/shared/lib';
import { Link } from 'react-router-dom';

interface SubmitButtonProps {
  isPending?: boolean;
  isDisabled?: boolean;
  text?: string;
  pendingText?: string;
  icon?: LucideIcon | null;
  onClick?: () => void;
  className?: string;
  type?: 'submit' | 'button' | 'reset';
  isLink?: boolean;
  linkTo?: string;
}

export const SubmitButton = ({
                               isPending = false,
                               isDisabled = false,
                               text = 'Change Password',
                               pendingText = 'Saving...',
                               icon: Icon = Save,
                               onClick,
                               className,
                               type = 'submit',
                               isLink = false,
                               linkTo = '#'
                             }: SubmitButtonProps) => {
  const content = (
    <>
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white"/>
          <span>{pendingText}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4"/>}
          <span>{text}</span>
        </>
      )}
    </>
  );

  const sharedClasses = cn(
    'flex items-center gap-2 px-4 py-4.5 text-sm font-medium text-white bg-linear-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 active:from-teal-800 active:to-teal-700 cursor-pointer shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-teal-500/20 disabled:opacity-50 disabled:pointer-events-none rounded-xl',
    className
  );

  if (isLink) {
    return (
      <Button
        render={(props) => <Link to={linkTo} {...props} />}
        className={sharedClasses}
      >
        {content}
      </Button>
    );
  }

  return (
    <Button
      type={type}
      disabled={isDisabled || isPending}
      onClick={onClick}
      className={sharedClasses}
    >
      {content}
    </Button>
  );
};