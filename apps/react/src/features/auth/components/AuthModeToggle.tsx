import React from 'react';
import { Button } from '@pipeline/ui';
import type { FormMode } from '../types';

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
        className="cursor-pointer px-1 bg-transparent font-medium text-zinc-200 hover:text-white transition-colors hover:bg-transparent focus:outline-none hover:underline"
      >
        {mode === 'login' ? 'Sign up' : 'Sign in'}
      </Button>
    </>
  );
};