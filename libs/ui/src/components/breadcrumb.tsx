import * as React from 'react';
import { LuChevronRight } from 'react-icons/lu';

import { cn } from '../lib/utils';
import { NavLink } from 'react-router-dom';

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        'text-muted-foreground flex flex-wrap items-center gap-0.5 text-sm wrap-break-words sm:gap-1',
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="breadcrumb-item" className={cn('inline-flex items-center gap-0.5', className)} {...props} />;
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('text-foreground font-normal', className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <LuChevronRight />}
    </li>
  );
}

type BreadcrumbItemType = {
  label?: string;
  to?: string;
};
type CustomBreadcrumbProps = {
  items: BreadcrumbItemType[];
};

const CustomBreadcrumb = ({ items }: CustomBreadcrumbProps) => {
  return (
    <div className="mb-3 breadcrumb">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <span key={index} className="flex items-center gap-1.5">
              <BreadcrumbItem>
                {isLast || !item.to ? (
                  <BreadcrumbPage className="font-medium">{item.label}</BreadcrumbPage>
                ) : (
                  <NavLink to={item.to}>{item.label}</NavLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </span>
          );
        })}
      </BreadcrumbList>
    </div>
  );
};

export { CustomBreadcrumb };
