import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/shared/lib/sanity', () => ({
  urlFor: () => ({
    width: () => ({ url: () => 'https://cdn/img.jpg' }),
  }),
}));

vi.mock('@portabletext/react', () => {
  type TArgs = { children?: ReactNode; value?: unknown };
  type TComp = (args: TArgs) => ReactNode;

  type TBlock = {
    _type: string;
    style?: string;
    children?: Array<{ text?: string }>;
    markValue?: unknown;
    asset?: unknown;
    alt?: string;
    caption?: string;
    language?: string;
    code?: string;
  };

  type TComponents = {
    block?: Record<string, TComp>;
    list?: Record<string, TComp>;
    listItem?: Record<string, TComp>;
    marks?: Record<string, TComp>;
    types?: Record<string, TComp>;
  };

  return {
    PortableText: ({ value, components }: { value: TBlock[]; components: TComponents }) => (
      <div data-testid="portable-root">
        {value.map((b, i) => {
          const text = b.children?.[0]?.text ?? '';

          if (b._type === 'mark') {
            const M = components.marks?.[b.style ?? ''];
            return M ? (
              <div data-testid={`mark-${b.style}`} key={i}>
                {M({ value: b.markValue, children: text })}
              </div>
            ) : null;
          }

          if (b._type === 'list-item') {
            const L = components.list?.[b.style ?? ''];
            const I = components.listItem?.[b.style ?? ''];
            if (!L || !I) return null;
            return (
              <div data-testid={`li-${b.style}`} key={i}>
                {L({ children: I({ children: text }) })}
              </div>
            );
          }

          if (b._type === 'image' || b._type === 'code' || b._type === 'divider') {
            const C = components.types?.[b._type];
            return C ? (
              <div data-testid={`type-${b._type}`} key={i}>
                {C({ value: b })}
              </div>
            ) : null;
          }

          const B = components.block?.[b.style ?? 'normal'];
          return B ? (
            <div data-testid={`block-${b.style ?? 'normal'}`} key={i}>
              {B({ children: text })}
            </div>
          ) : null;
        })}
      </div>
    ),
  };
});

import { PortableBody } from './PortableBody';
import type { PortableTextBlock } from '@portabletext/react';

const base = { _key: 'k', _type: 'block' };

const value = [
  { ...base, style: 'normal', children: [{ text: 'para' }] },
  { ...base, style: 'h1', children: [{ text: 'h1' }] },
  { ...base, style: 'h2', children: [{ text: 'h2' }] },
  { ...base, style: 'h3', children: [{ text: 'h3' }] },
  { ...base, style: 'h4', children: [{ text: 'h4' }] },
  { ...base, style: 'blockquote', children: [{ text: 'q' }] },
  { _key: 'k1', _type: 'mark', style: 'strong', children: [{ text: 'b' }] },
  { _key: 'k2', _type: 'mark', style: 'em', children: [{ text: 'i' }] },
  { _key: 'k3', _type: 'mark', style: 'code', children: [{ text: 'c' }] },
  { _key: 'k4', _type: 'mark', style: 'underline', children: [{ text: 'u' }] },
  { _key: 'k5', _type: 'mark', style: 'strike-through', children: [{ text: 's' }] },
  {
    _key: 'k6',
    _type: 'mark',
    style: 'link',
    markValue: { href: 'https://external.com', blank: true },
    children: [{ text: 'ext' }],
  },
  {
    _key: 'k7',
    _type: 'mark',
    style: 'link',
    markValue: { href: '/internal' },
    children: [{ text: 'int' }],
  },
  {
    _key: 'k7b',
    _type: 'mark',
    style: 'link',
    markValue: undefined,
    children: [{ text: 'nolink' }],
  },
  { _key: 'k8', _type: 'list-item', style: 'bullet', children: [{ text: 'li-b' }] },
  { _key: 'k9', _type: 'list-item', style: 'number', children: [{ text: 'li-n' }] },
  { _key: 'k10', _type: 'code', language: 'ts', code: 'const x = 1' },
  { _key: 'k11', _type: 'divider' },
  { _key: 'k12', _type: 'image', asset: {}, alt: 'Alt', caption: 'Cap' },
  { _key: 'k13', _type: 'image', asset: {}, alt: undefined, caption: undefined },
  { _key: 'k14', _type: 'image' },
] as unknown as PortableTextBlock[];

describe('PortableBody', () => {
  it('renders block styles', () => {
    render(<PortableBody value={value} />);
    expect(screen.getByTestId('block-normal')).toHaveTextContent('para');
    expect(screen.getByTestId('block-h1')).toHaveTextContent('h1');
    expect(screen.getByTestId('block-h2')).toHaveTextContent('h2');
    expect(screen.getByTestId('block-h3')).toHaveTextContent('h3');
    expect(screen.getByTestId('block-h4')).toHaveTextContent('h4');
    expect(screen.getByTestId('block-blockquote')).toHaveTextContent('q');
  });

  it('renders inline marks', () => {
    render(<PortableBody value={value} />);
    expect(screen.getByTestId('mark-strong')).toHaveTextContent('b');
    expect(screen.getByTestId('mark-em')).toHaveTextContent('i');
    expect(screen.getByTestId('mark-code')).toHaveTextContent('c');
    expect(screen.getByTestId('mark-underline')).toHaveTextContent('u');
    expect(screen.getByTestId('mark-strike-through')).toHaveTextContent('s');
  });

  it('renders external link with target=_blank', () => {
    render(<PortableBody value={value} />);
    const external = screen.getByText('ext').closest('a') as HTMLAnchorElement;
    expect(external).toHaveAttribute('href', 'https://external.com');
    expect(external).toHaveAttribute('target', '_blank');
    expect(external).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders internal link without target', () => {
    render(<PortableBody value={value} />);
    const internal = screen.getByText('int').closest('a') as HTMLAnchorElement;
    expect(internal).toHaveAttribute('href', '/internal');
    expect(internal).not.toHaveAttribute('target');
  });

  it('falls back to href="#" when link mark value is missing', () => {
    render(<PortableBody value={value} />);
    const nolink = screen.getByText('nolink').closest('a') as HTMLAnchorElement;
    expect(nolink).toHaveAttribute('href', '#');
  });

  it('renders bullet and number lists', () => {
    render(<PortableBody value={value} />);
    expect(screen.getByTestId('li-bullet')).toHaveTextContent('li-b');
    expect(screen.getByTestId('li-number')).toHaveTextContent('li-n');
  });

  it('renders code block with language', () => {
    render(<PortableBody value={value} />);
    const code = screen.getByText('const x = 1');
    expect(code.tagName).toBe('CODE');
    expect(code).toHaveAttribute('data-lang', 'ts');
  });

  it('renders divider', () => {
    render(<PortableBody value={value} />);
    expect(screen.getByTestId('type-divider').querySelector('hr')).toBeInTheDocument();
  });

  it('renders image with alt and caption', () => {
    render(<PortableBody value={value} />);
    expect(screen.getByAltText('Alt')).toBeInTheDocument();
    expect(screen.getByText('Cap')).toBeInTheDocument();
  });

  it('renders image without alt/caption using empty fallbacks', () => {
    render(<PortableBody value={value} />);
    const imageBlocks = screen.getAllByTestId('type-image');
    expect(imageBlocks).toHaveLength(3);

    const noCaptionImg = imageBlocks[1].querySelector('img') as HTMLImageElement;
    expect(noCaptionImg).toHaveAttribute('alt', '');
    expect(imageBlocks[1].querySelector('figcaption')).toBeNull();
  });

  it('skips image without asset', () => {
    render(<PortableBody value={value} />);
    const imageBlocks = screen.getAllByTestId('type-image');
    expect(imageBlocks[2].querySelector('img')).toBeNull();
  });

  it('renders root wrapper', () => {
    render(<PortableBody value={value} />);
    expect(screen.getByTestId('portable-root')).toBeInTheDocument();
  });
});
