import { Code2, Palette, FlaskConical, Rocket, FileCode, type LucideIcon } from 'lucide-react';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  engineering: Code2,
  design: Palette,
  research: FlaskConical,
  product: Rocket,
};

const DEFAULT_CATEGORY_ICON = FileCode;

export { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON };
