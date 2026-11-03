import * as React from 'react';
import { Progress as ProgressPrimitive } from 'radix-ui';

import { cn } from '../lib/utils';

function Progress({
  className,
  value,
  progressColor,
  trackColor = 'bg-primary/20',
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  progressColor?: string;
  trackColor?: string;
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('relative h-2 w-full overflow-hidden rounded-full', trackColor, className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn('h-full w-full flex-1 bg-primary transition-all', progressColor)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
