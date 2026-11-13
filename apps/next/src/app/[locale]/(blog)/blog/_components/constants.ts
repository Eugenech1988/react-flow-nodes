import { Code2, Palette, FlaskConical, Rocket, FileCode, type LucideIcon } from 'lucide-react';

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  engineering: Code2,
  design: Palette,
  research: FlaskConical,
  product: Rocket,
};

export const BLOG_PAGE_SIZE = 3;

export const DEFAULT_CATEGORY_ICON = FileCode;

export const BLOG_CATEGORIES = [
  { id: 'all', code: '01' },
  { id: 'engineering', code: '02' },
  { id: 'design', code: '03' },
  { id: 'research', code: '04' },
  { id: 'product', code: '05' },
];

export interface IBlogPostData {
  id: string;
  slug: string;
  category: string;
  date: string;
  readTime: number;
  author: string;
  featured?: boolean;
  content: string[];
}

export const BLOG_POSTS: IBlogPostData[] = [
  {
    id: '001',
    slug: 'declarative-pipeline-as-code',
    category: 'engineering',
    date: '2026.10.14',
    readTime: 8,
    author: 'eugene',
    featured: true,
    content: [
      'The declarative approach to building pipelines is not just a trend; it is a <strong>fundamental shift</strong> in how we think about infrastructure and data flow.',
      'Instead of writing imperative scripts that tell the system <em>how</em> to do something step-by-step, we define the desired end state and let the system figure out how to reach it.',
      'Here is a basic example of what a declarative schema might look like:',
      '<pre><code class="language-json">{\n  "name": "my-pipeline",\n  "steps": [\n    { "type": "fetch", "source": "api" },\n    { "type": "transform", "script": "normalize" }\n  ]\n}</code></pre>',
      'This approach eliminates a massive class of bugs related to race conditions and state management. It makes the pipelines idempotent, meaning you can run them a thousand times and the result will always be the same.',
      'In this entry, we explore the architecture behind our declarative engine and why it scales better for modern edge computing. <a href="#">Read the docs</a> for more.',
    ],
  },
  {
    id: '002',
    slug: 'designing-for-speed',
    category: 'design',
    date: '2026.10.02',
    readTime: 6,
    author: 'jane',
    content: [
      'Latency is not a backend problem; it is a design constraint.',
      'Every millisecond we shave off the interaction time translates directly into user satisfaction and conversion rates.',
      'We believe in designing for speed from the very first wireframe. This means minimizing cognitive load, optimizing rendering paths, and treating every animation as a performance budget.',
    ],
  },
  {
    id: '003',
    slug: 'the-future-of-ai-infra',
    category: 'research',
    date: '2026.09.21',
    readTime: 12,
    author: 'marcus',
    content: [
      'As AI models become the product, the infrastructure that runs them becomes the ultimate bottleneck.',
      'We are moving from an era of compute-heavy training to an era of inference-heavy deployment. The challenge is no longer just about raw FLOPs, but about routing, batching, and latency.',
    ],
  },
  {
    id: '004',
    slug: 'ship-fast-ship-safe',
    category: 'engineering',
    date: '2026.09.08',
    readTime: 5,
    author: 'elena',
    content: [
      'Velocity and reliability are often seen as opposing forces. We think they are two sides of the same coin.',
      'If your deployment pipeline is slow and scary, you ship less often. If you ship less often, you introduce more risk with each deployment.',
      'The secret to shipping fast and safe is automation, observability, and trust in your edge infrastructure.',
    ],
  },
  {
    id: '005',
    slug: 'product-velocity-metrics',
    category: 'product',
    date: '2026.08.30',
    readTime: 7,
    author: 'viktor',
    content: [
      'What signals actually predict shipping speed, and which ones lie?',
      'Lines of code, story points, and ticket counts are vanity metrics. They measure activity, not outcomes.',
      'The only true metric of product velocity is the time it takes from concept to production feedback.',
    ],
  },
  {
    id: '006',
    slug: 'visual-hierarchy-in-terminal-ui',
    category: 'design',
    date: '2026.08.15',
    readTime: 9,
    author: 'sarah',
    content: [
      'Designing dense interfaces that do not feel cluttered is an art form.',
      'Terminal UIs rely on typographic contrast, spacing, and color strategically applied to guide the eye.',
      'We use monospace fonts, subtle grid alignments, and high-contrast accent colors to make the most complex data readable.',
    ],
  },
];
