'use client';

// import { Globe } from 'lucide-react';
import type { SVGProps } from 'react';
import { useT } from '@/shared/lib/i18n/client';
import { cn } from '@/shared/lib';

export const GithubIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const LinkedinIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export const XTwitterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const TelegramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

export const FacebookIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

interface SocialLinksProps {
  title?: string;
  className?: string;
  iconClassName?: string;
  align?: 'start' | 'center' | 'end';
  size?: 'sm' | 'md';
  theme?: 'default' | 'careers';
}

export const SOCIAL_NODES = [
  { id: 'github', icon: GithubIcon, href: 'https://github.com' },
  { id: 'linkedin', icon: LinkedinIcon, href: 'https://linkedin.com' },
  { id: 'twitter', icon: XTwitterIcon, href: 'https://twitter.com' },
  // { id: 'telegram', icon: TelegramIcon, href: 'https://t.me' },
  // { id: 'website', icon: Globe, href: 'https://example.com' },
];

export const SocialLinks = ({
  title,
  className,
  align = 'start',
  size = 'md',
  theme = 'default',
}: SocialLinksProps) => {
  const { t } = useT('common');

  const sizeClasses = {
    sm: {
      container: 'h-9 w-9 rounded-lg',
      icon: 'h-4 w-4',
    },
    md: {
      container: 'h-11 w-11 rounded-xl',
      icon: 'h-5 w-5',
    },
  };

  const themeClasses = {
    default: {
      base: 'border-[#2dd4bf]/20 bg-[#040a09] text-slate-400 hover:border-[#2dd4bf]/50 hover:bg-[#2dd4bf]/10 hover:text-[#2dd4bf] hover:shadow-[0_0_15px_rgba(45,212,191,0.2)]',
    },
    careers: {
      base: 'border-[#4a5c52]/40 bg-[#0a0e0d] text-[#8a9488] hover:border-[#6fa28c]/60 hover:bg-[#6fa28c]/10 hover:text-[#d4cfc0] hover:shadow-[0_0_15px_rgba(111,162,140,0.2)]',
    },
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {title && (
        <div
          className={cn(
            'mb-4 font-mono text-[10px] tracking-widest uppercase',
            theme === 'careers' ? 'text-[#6fa28c]/70' : 'text-[#2dd4bf]/50',
            align === 'center' && 'text-center',
            align === 'end' && 'text-right',
          )}
        >
          {title}
        </div>
      )}

      <div
        className={cn(
          'flex items-center gap-3',
          align === 'center' && 'justify-center',
          align === 'end' && 'justify-end',
        )}
      >
        {SOCIAL_NODES.map((node) => {
          const Icon = node.icon;
          return (
            <a
              key={node.id}
              href={node.href}
              target="_blank"
              rel="noopener noreferrer"
              title={t(`socials.${node.id}`, { defaultValue: node.id })}
              aria-label={t(`socials.${node.id}`, { defaultValue: node.id })}
              className={cn(
                'group flex items-center justify-center border transition-all duration-300',
                sizeClasses[size].container,
                themeClasses[theme].base,
              )}
            >
              <Icon className={sizeClasses[size].icon} />
            </a>
          );
        })}
      </div>
    </div>
  );
};
