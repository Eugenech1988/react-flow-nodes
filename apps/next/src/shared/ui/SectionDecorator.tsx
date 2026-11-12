import { LucideIcon } from 'lucide-react';

interface ISectionDecorProps {
  icon: LucideIcon;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  opacity?: number;
  theme?: 'default' | 'careers' | 'blog';
}

export const SectionDecorator = ({
  icon: Icon,
  position,
  opacity = 0.02,
  theme: _theme = 'default',
}: ISectionDecorProps) => {
  const posClasses = {
    'top-left': 'top-20 -left-20',
    'top-right': 'top-20 -right-20',
    'bottom-left': 'bottom-20 -left-20',
    'bottom-right': 'bottom-20 -right-20',
  };

  return (
    <Icon
      className={`text-theme-accent pointer-events-none absolute h-96 w-96 ${posClasses[position]}`}
      style={{ opacity }}
    />
  );
};
