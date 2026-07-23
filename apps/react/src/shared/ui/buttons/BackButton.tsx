import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string;
  text?: string;
  onClick?: () => void;
}

export const BackButton = ({ to = '/', text = 'Back to app', onClick }: BackButtonProps) => (
  <Link
    to={to}
    onClick={onClick}
    className="group flex items-center gap-2 px-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-md"
  >
    <ArrowLeft className="w-4 h-4" />
    <span>{text}</span>
  </Link>
);