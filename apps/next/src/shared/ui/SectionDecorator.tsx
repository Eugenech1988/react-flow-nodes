import type { LucideIcon } from 'lucide-react';

interface ISectionDecorProps {
  icon: LucideIcon;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  opacity?: number;
}

const POS_CLASSES: Record<ISectionDecorProps['position'], string> = {
  'top-left': 'top-20 -left-20',
  'top-right': 'top-20 -right-20',
  'bottom-left': 'bottom-20 -left-20',
  'bottom-right': 'bottom-20 -right-20',
};

export const SectionDecorator = ({ icon: Icon, position, opacity = 0.02 }: ISectionDecorProps) => (
  <Icon
    className={`text-theme-accent pointer-events-none absolute h-96 w-96 ${POS_CLASSES[position]}`}
    style={{ opacity }}
  />
);
