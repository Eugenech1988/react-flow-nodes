'use client';

import Link from 'next/link';
import { ShieldAlert, Radio, Share2 } from 'lucide-react';
import { Frame, Reveal, AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import type { IBlogPostData } from '../../_components/constants';

interface IBlogPostSidebarProps {
  post: IBlogPostData;
  locale: string;
}

export const BlogPostSidebar = ({ post, locale }: IBlogPostSidebarProps) => {
  const { t } = useT('blog');

  return (
    <div className="hidden lg:sticky lg:top-24 lg:block">
      <Reveal delay={150}>
        <Frame
          theme="blog"
          headerIcon={Radio}
          headerTitle="TRANSMIT.DATA"
          footer={
            <div className="text-theme-accent flex items-center gap-2 font-mono text-[9px] tracking-widest uppercase">
              <ShieldAlert className="h-3 w-3" />
              {t('details.secureChannel', { defaultValue: 'SECURE CHANNEL' })}
            </div>
          }
        >
          <div className="flex flex-col p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="border-theme-line bg-theme-bg text-theme-accent flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border shadow-[inset_0_0_15px_color-mix(in_oklab,var(--theme-accent)_10%,transparent)]">
                <span className="font-mono text-xl font-bold uppercase">
                  {post.author.substring(0, 2)}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-theme-dim font-mono text-[9px] tracking-widest uppercase">
                  {t('details.author', { defaultValue: 'AUTHOR' })}
                </span>
                <span className="text-theme-fg font-typewriter font-bold uppercase">
                  {post.author}
                </span>
              </div>
            </div>

            <div className="border-theme-line/50 bg-theme-bg/30 mb-8 space-y-4 rounded-sm border p-4">
              <div className="text-theme-muted flex items-center gap-3 font-mono text-xs">
                <span className="text-theme-dim w-12">DATE:</span>
                <span>{post.date}</span>
              </div>
              <div className="text-theme-muted flex items-center gap-3 font-mono text-xs">
                <span className="text-theme-dim w-12">TIME:</span>
                <span>T-{String(post.readTime).padStart(2, '0')}</span>
              </div>
              <div className="text-theme-muted flex items-center gap-3 font-mono text-xs">
                <span className="text-theme-dim w-12">TYPE:</span>
                <span className="text-theme-accent uppercase">{post.category}</span>
              </div>
            </div>

            <AppButton
              variant="blog-outline"
              size="md"
              icon={Share2}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: t(`posts.${post.slug}.title`),
                    url: window.location.href,
                  });
                }
              }}
              className="w-full"
            >
              {t('details.share', { defaultValue: 'Share Entry' })}
            </AppButton>

            <div className="border-theme-line text-theme-dim mt-6 border-t pt-4 text-center font-mono text-[10px] tracking-widest">
              <Link
                href={`/${locale}/blog`}
                className="text-theme-accent hover:text-theme-accent-hover mt-1 block hover:underline"
              >
                &lt; RETURN TO ARCHIVE
              </Link>
            </div>
          </div>
        </Frame>
      </Reveal>
    </div>
  );
};
