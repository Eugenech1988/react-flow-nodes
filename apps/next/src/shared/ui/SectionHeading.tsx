interface HeroHeadingProps {
  title: string;
  description: string;
  className?: string;
}

export const HeroHeading = ({ title, description, className }: HeroHeadingProps) => {
  return (
    <div className={`mx-auto max-w-4xl text-center ${className || ''}`}>
      <h1 className="mx-auto max-w-4xl text-3xl leading-tight font-extrabold tracking-tight text-transparent uppercase sm:text-5xl md:text-6xl">
        <span className="bg-linear-to-r from-white via-neutral-100 to-[#39b39b] bg-clip-text drop-shadow-[0_2px_10px_rgba(57,179,155,0.2)]">
          {title}
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl font-mono text-sm leading-relaxed text-neutral-400 sm:text-base md:text-lg">
        {description}
      </p>
    </div>
  );
};
