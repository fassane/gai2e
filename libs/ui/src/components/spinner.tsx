import { ImSpinner3 } from 'react-icons/im';
import { cn } from '../lib/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <ImSpinner3
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin animation-duration-[0.9s] motion-reduce:hidden', className)}
      {...props}
    />
  );
}

export { Spinner };
