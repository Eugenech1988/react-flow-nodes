import React from 'react';
import { Button } from '@pipeline/ui';
import type { FormMode } from '../model/types';

interface AuthModeToggleProps {
  mode: FormMode;
  onToggle: () => void;
}

export const AuthModeToggle: React.FC<AuthModeToggleProps> = ({ mode, onToggle }) => {
  return (
    <>
      {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
      <Button
        type="button"
        onClick={onToggle}
        className="cursor-pointer bg-transparent px-1 font-medium text-zinc-100 transition-colors hover:bg-transparent hover:text-white hover:underline focus:outline-none"
      >
        {mode === 'login' ? 'Sign up' : 'Sign in'}
      </Button>
    </>
  );
};
