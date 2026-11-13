'use client';

import { PortableBody, IBlogPostDetail } from '.';

interface IBlogPostBodyProps {
  post: IBlogPostDetail;
}

export const BlogPostBody = ({ post }: IBlogPostBodyProps) => (
  <div className="max-w-none">
    <p className="font-typewriter text-theme-accent-hover border-theme-accent/50 mb-8 border-l-2 pl-4 text-lg italic sm:text-xl">
      {post.excerpt}
    </p>

    <PortableBody value={post.body} />

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
