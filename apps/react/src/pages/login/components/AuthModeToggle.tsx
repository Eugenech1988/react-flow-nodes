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
      <span className="text-zinc-500">
        {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
      </span>
      <Button
        type="button"
        onClick={onToggle}
        className="cursor-pointer bg-transparent p-0 font-medium text-teal-400 transition-colors hover:bg-transparent hover:text-teal-300 hover:underline focus:outline-none"
      >
        {mode === 'login' ? 'Sign up' : 'Sign in'}
      </Button>
    </>
  );
};