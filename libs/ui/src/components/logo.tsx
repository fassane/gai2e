import { LuGraduationCap } from 'react-icons/lu';
import { cn } from '../lib/utils';

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'flex size-9 items-center justify-center rounded-full',
          light ? 'bg-white/15 text-white' : 'bg-primary text-primary-foreground',
        )}
      >
        <LuGraduationCap className="size-5" />
      </span>
      <span className={cn('font-serif text-xl tracking-tight', light ? 'text-white' : 'text-primary')}>
        <span className="font-bold">GAI2E</span> <span className="font-medium">Conseils</span>
      </span>
    </span>
  );
}
