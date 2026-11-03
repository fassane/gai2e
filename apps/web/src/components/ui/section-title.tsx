import { cn } from '@gai2e/ui';

interface SectionTitleProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

export function SectionTitle({ title, eyebrow, subtitle, align = 'center', className }: SectionTitleProps) {
  return (
    <div className={cn('mb-12 max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-peach uppercase">{eyebrow}</p>}
      <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
