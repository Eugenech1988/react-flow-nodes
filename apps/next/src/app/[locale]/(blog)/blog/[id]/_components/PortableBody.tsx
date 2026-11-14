'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
  type PortableTextMarkComponent,
  type PortableTextTypeComponent,
} from '@portabletext/react';
import {
  urlFor,
  ILinkMark,
  IImageBlockValue,
  ICodeBlockValue,
  IDividerBlockValue,
} from '@/shared/lib/sanity';

const LINK_CLASS =
  'text-theme-accent-hover underline decoration-current/30 underline-offset-4 hover:text-theme-accent';

const LinkMark: PortableTextMarkComponent<ILinkMark> = ({ value, children }) => {
  const href = value?.href ?? '#';
  const isExternal = /^https?:\/\//.test(href);
  const openNew = value?.blank === true || isExternal;

  if (openNew) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={LINK_CLASS}>
      {children}
    </Link>
  );
};

const ImageBlock: PortableTextTypeComponent<IImageBlockValue> = ({ value }) => {
  if (!value.asset) return null;

  return (
    <figure className="my-8">
      <Image
        src={urlFor(value.asset).width(1200).url()}
        alt={value.alt ?? ''}
        width={1200}
        height={800}
        className="border-theme-line rounded-sm border"
      />
      {value.caption && (
        <figcaption className="text-theme-dim mt-2 text-center font-mono text-xs">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
};

const CodeBlock: PortableTextTypeComponent<ICodeBlockValue> = ({ value }) => (
  <pre className="border-theme-line bg-theme-panel/80 my-6 overflow-x-auto rounded-sm border p-4">
    <code className="text-theme-accent font-mono text-sm" data-lang={value.language}>
      {value.code}
    </code>
  </pre>
);

const DividerBlock: PortableTextTypeComponent<IDividerBlockValue> = () => (
  <hr className="border-theme-line my-10 border-dashed" />
);

const components: PortableTextComponents = {
  marks: {
    link: LinkMark,
    strong: ({ children }) => <strong className="text-theme-fg font-bold">{children}</strong>,
    em: ({ children }) => <em className="text-theme-accent italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-theme-panel text-theme-accent rounded px-1.5 py-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    ),
    underline: ({ children }) => <span className="underline">{children}</span>,
    'strike-through': ({ children }) => <s>{children}</s>,
  },
  block: {
    normal: ({ children }) => <p className="mb-6 leading-relaxed">{children}</p>,
    h1: ({ children }) => (
      <h1 className="text-theme-fg mt-10 mb-4 text-3xl font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-theme-fg mt-8 mb-3 text-2xl font-bold">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="text-theme-fg mt-6 mb-2 text-xl font-bold">{children}</h3>,
    h4: ({ children }) => <h4 className="text-theme-fg mt-4 mb-2 text-lg font-bold">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-theme-accent/50 text-theme-accent-hover my-6 border-l-2 pl-4 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 list-disc space-y-2 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 list-decimal space-y-2 pl-6">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  types: {
    image: ImageBlock,
    code: CodeBlock,
    divider: DividerBlock,
  },
};

interface IPortableBodyProps {
  value: PortableTextBlock[];
}

export const PortableBody = ({ value }: IPortableBodyProps) => (
  <div className="text-theme-muted space-y-2 text-sm leading-relaxed sm:text-base sm:leading-loose">
    <PortableText value={value} components={components} />
  </div>
);
