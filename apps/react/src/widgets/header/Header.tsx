import logo from '@/assets/logo.svg';

import { ThemeToggle } from '@/features/toggle-theme';

export const Header = () => {
  return (
    <header className="flex bg-background h-14 w-full items-center justify-between px-6 border-b border-border z-40 shrink-0 transition-colors duration-300">
      <img className='h-auto w-100% max-w-13' src={logo} alt=""/>

      <div>
        <ThemeToggle/>
      </div>
    </header>
  );
};