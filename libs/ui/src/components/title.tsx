import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

// Titre de page, avec un sous-titre optionnel
function TopTitle({
  title,
  paragraph,
  wrapperClassName,
  className,
}: {
  title: string;
  paragraph?: string;
  wrapperClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn('mb-6', wrapperClassName)}>
      <h2 title={title} className={cn('font-serif text-2xl font-semibold tracking-tight md:text-3xl', className)}>
        {title}
      </h2>
      {paragraph && <p className="mt-1 line-clamp-2 text-muted-foreground">{paragraph}</p>}
    </div>
  );
}

// Titre de bloc
function MediumTitle({ title, className }: { title: string; className?: string }) {
  return (
    <h4 title={title} className={cn('mb-3 font-serif text-lg font-semibold lg:text-xl', className)}>
      {title}
    </h4>
  );
}

function TitleWithIcon({ title, icon, className }: { title: string; icon: ReactNode; className?: string }) {
  return (
    <h4 title={title} className={cn('mb-3 flex items-center gap-2 text-lg font-semibold', className)}>
      <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-primary [&_svg]:size-4">
        {icon}
      </span>
      {title}
    </h4>
  );
}

export { TopTitle, MediumTitle, TitleWithIcon };
