interface ISectionHeadingProps {
  title: string;
  description?: string;
  align?: 'left' | 'center';
  isMain?: boolean;
  className?: string;
  titleClassName?: string;
  gradientDirection?: 'left' | 'right';
  gradientColors?: string;
  titleColor?: string;
  descriptionColor?: string;
}

export const SectionHeading = ({
                                 title,
                                 description,
                                 align = 'center',
                                 isMain = false,
                                 className = '',
                                 titleClassName = '',
                                 gradientDirection = 'right',
                                 gradientColors = 'from-[#5eead4] via-[#2dd4bf] to-[#0d9488]',
                                 titleColor = 'text-[#d1faf5]',
                                 descriptionColor = 'text-[#8db8b4]',
                               }: ISectionHeadingProps) => {
  const isCenter = align === 'center';
  const Tag = isMain ? 'h1' : 'h2';

  const titleSizeClasses = isMain
    ? 'text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.05]'
    : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]';

  const descSizeClasses = isMain
    ? 'text-base sm:text-lg md:text-xl mt-6'
    : 'text-sm sm:text-base md:text-lg mt-4';

  const directionClass = gradientDirection === 'left' ? 'bg-linear-to-l' : 'bg-linear-to-r';

  return (
    <div
      className={`flex w-full flex-col ${
        isCenter ? 'mx-auto max-w-4xl items-center text-center' : 'max-w-5xl items-start text-left'
      } ${className}`}
    >
      <Tag
        className={`font-extrabold tracking-tight ${titleColor} ${titleSizeClasses} ${
          isCenter ? 'mx-auto' : ''
        } ${titleClassName}`}
      >
        <span
          className={`${directionClass} ${gradientColors} bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(111,162,140,0.2)]`}
        >
          {title}
        </span>
      </Tag>

      {description && (
        <p
          className={`leading-relaxed ${descriptionColor} ${descSizeClasses} ${
            isCenter ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};