import logo from '@/assets/logo.svg';

import { ThemeToggle } from '@/features/toggle-theme';

export const Header = () => {
  return (
    <header className="flex bg-background w-full min-h-11 items-center justify-between px-4 border-b border-border shrink-0 transition-colors duration-300">
      <img className='h-auto w-100% max-w-10' src={logo} alt=""/>

      <div>
        <ThemeToggle/>
      </div>
    </header>
  );
};