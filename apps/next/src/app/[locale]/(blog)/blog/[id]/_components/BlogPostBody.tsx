'use client';

import DOMPurify from 'isomorphic-dompurify';
import { useT } from '@/shared/lib/i18n/client';
import type { IBlogPostData } from '../../_components/constants';

export const BlogPostBody = ({ post }: { post: IBlogPostData }) => {
  const { t } = useT('blog');

  return (
    <div className="max-w-none">
      <p className="font-typewriter text-theme-accent-hover border-theme-accent/50 mb-8 border-l-2 pl-4 text-lg italic sm:text-xl">
        {t(`posts.${post.slug}.excerpt`)}
      </p>

      <div className="text-theme-muted [&_strong]:text-theme-fg [&_em]:text-theme-accent [&_a]:text-theme-accent-hover [&_a:hover]:text-theme-accent [&_code]:bg-theme-panel [&_code]:text-theme-accent [&_pre]:border-theme-line [&_pre]:bg-theme-panel/80 space-y-6 text-sm leading-relaxed sm:text-base sm:leading-loose [&_a]:underline [&_a]:decoration-current/30 [&_a]:underline-offset-4 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_em]:italic [&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:border [&_pre]:p-4 [&_strong]:font-bold">
        {post.content.map((htmlBlock, index) => {
          // Очищаем HTML перед рендером
          const cleanHtml = DOMPurify.sanitize(htmlBlock);

          return <div key={index} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
        })}
      </div>

      <div className="border-theme-line mt-12 mb-4 flex items-center gap-4 border-t pt-8">
        <span className="bg-theme-accent/20 text-theme-accent rounded px-2 py-1 font-mono text-[10px] tracking-widest uppercase">
          EOF
        </span>
        <span className="text-theme-dim font-mono text-[10px] tracking-widest uppercase">
          END OF TRANSMISSION
        </span>
        <div className="bg-theme-line h-px flex-1 opacity-50" />
      </div>
    </div>
  );
};
