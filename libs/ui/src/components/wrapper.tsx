import { cn } from '../lib/utils';

//
function ColgateWrapper({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('rounded-3xl border bg-card p-4 shadow-xs md:p-6', className)} {...props} />;
}

export { ColgateWrapper };
