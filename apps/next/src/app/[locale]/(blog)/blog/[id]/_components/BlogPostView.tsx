'use client';

import Link from 'next/link';
import { Activity, ChevronLeft } from 'lucide-react';
import { Frame, Reveal } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { BlogPostHeader, BlogPostBody, BlogPostSidebar, IBlogPostDetail } from '.';

interface IBlogPostViewProps {
  post: IBlogPostDetail;
  locale: string;
}

export const BlogPostView = ({ post, locale }: IBlogPostViewProps) => {
  const { t } = useT('blog');
  const entryId = post.id ? post.id.slice(0, 6).toUpperCase() : '------';

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 sm:pt-26 sm:pb-16">
      <Reveal>
        <Link
          href={`/${locale}/blog`}
          className="text-theme-muted hover:text-theme-accent-hover mb-8 inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
          {t('details.returnToArchive', { defaultValue: 'Return to Archive' })}
        </Link>
      </Reveal>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
        <Reveal className="relative">
          <Frame
            theme="blog"
            headerIcon={Activity}
            headerTitle={`SYS.ARCHIVE // ENTRY.${entryId}`}
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
              <div className="theme-grid pointer-events-none absolute inset-0 bg-size-[30px_30px]" />

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
