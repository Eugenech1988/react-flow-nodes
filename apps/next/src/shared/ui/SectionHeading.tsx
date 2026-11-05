import { cn } from '@/shared/lib';

interface ISectionHeadingProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'center' | 'left';
  size?: 'normal' | 'large';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const SectionHeading = ({
                                 title,
                                 description,
                                 align = 'center',
                                 size = 'normal',
                                 className,
                                 as: HeadingTag = 'h2',
                               }: ISectionHeadingProps) => {
  return (
    <div
      className={cn(
        align === 'center' ? 'text-center mx-auto' : 'text-left',
        className
      )}
    >
      <HeadingTag
        className={cn(
          'font-extrabold tracking-tight text-slate-100 mx-auto',
          size === 'large'
            ? 'text-4xl sm:text-6xl leading-tight max-w-4xl'
            : 'text-3xl md:text-4xl lg:text-5xl'
        )}
      >
        {title}
      </HeadingTag>

      {description && (
        <p
          className={cn(
            'text-slate-400 max-w-2xl mx-auto',
            size === 'large' ? 'mt-6 text-lg' : 'mt-4 text-sm md:text-base leading-relaxed'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};