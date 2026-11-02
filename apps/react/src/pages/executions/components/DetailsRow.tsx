import type { ReactNode } from 'react';

type TDetailRowProps = {
  label: string;
  value: ReactNode;
  mono?: boolean;
  last?: boolean;
};

export const DetailsRow = ({ label, value, mono, last }: TDetailRowProps) => (
  <div className={`flex justify-between py-2 ${last ? '' : 'border-border/40 border-b'}`}>
    <span className="text-muted-foreground">{label}:</span>
    <span className={mono ? 'text-foreground font-mono' : 'text-foreground'}>{value}</span>
  </div>
);
