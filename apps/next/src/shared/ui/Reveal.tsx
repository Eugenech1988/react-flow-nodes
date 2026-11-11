'use client';

import { ReactNode } from 'react';
import { useInView } from '@/shared/hooks';
import { cn } from '@/shared/lib';

type TRevealAnimation = 'fade-up' | 'fade-left' | 'fade-right' | 'zoom';

interface IRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  animation?: TRevealAnimation;
}

export const Reveal = ({ children, delay = 0, className, animation = 'fade-up' }: IRevealProps) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  const animationClass: Record<TRevealAnimation, string> = {
    'fade-up': 'slide-in-from-bottom-8',
    'fade-left': 'slide-in-from-left-8',
    'fade-right': 'slide-in-from-right-8',
    zoom: 'zoom-in-95 slide-in-from-bottom-4',
  };

  return (
    <div
      ref={ref}
      className={cn(
        inView
          ? `animate-in fade-in ${animationClass[animation]} duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]`
          : 'opacity-0',
        className,
      )}
      style={{
        animationDelay: inView ? `${delay}ms` : '0ms',
        animationFillMode: 'both',
      }}
    >
      {children}
    </div>
  );
};
