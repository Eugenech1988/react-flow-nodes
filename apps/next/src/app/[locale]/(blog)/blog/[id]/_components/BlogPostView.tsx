'use client';

import Link from 'next/link';
import { Activity, ArrowLeft } from 'lucide-react';
import { Frame, Reveal } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import type { IBlogPostData } from '../../_components/constants';
import { BlogPostHeader } from './BlogPostHeader';
import { BlogPostBody } from './BlogPostBody';
import { BlogPostSidebar } from './BlogPostSidebar';

interface IBlogPostViewProps {
  post: IBlogPostData;
  locale: string;
}

export const BlogPostView = ({ post, locale }: IBlogPostViewProps) => {
  const { t } = useT('blog');

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 sm:pt-26 sm:pb-16">
      <Reveal>
        <Link
          href={`/${locale}/blog`}
          className="text-theme-muted hover:text-theme-accent-hover mb-8 inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('details.returnToArchive', { defaultValue: 'Return to Archive' })}
        </Link>
      </Reveal>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
        <Reveal className="relative">
          <Frame
            theme="blog"
            headerIcon={Activity}
            headerTitle={`SYS.ARCHIVE // ENTRY.${post.id}`}
            footer={
              <div className="text-theme-dim flex w-full items-center justify-between font-mono text-[10px] tracking-widest uppercase">
                <span className="flex items-center gap-2">
                  <span className="bg-theme-accent h-1.5 w-1.5 animate-pulse rounded-full" />
                  {t('details.fileDecrypted', { defaultValue: 'FILE.DECRYPTED' })}
                </span>
                <span className="text-theme-line">
                  {t('details.priority', { defaultValue: 'PRIORITY.TRANSMISSION' })}
                </span>
              </div>
            }
          >
            <div className="relative overflow-hidden p-5 sm:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(color-mix(in_oklab,var(--theme-accent)_3%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--theme-accent)_3%,transparent)_1px,transparent_1px)] bg-size-[30px_30px]" />

              <div className="relative z-10">
                <BlogPostHeader post={post} />
                <BlogPostBody post={post} />
              </div>
            </div>
          </Frame>
        </Reveal>

        <BlogPostSidebar post={post} locale={locale} />
      </div>
    </div>
  );
};
