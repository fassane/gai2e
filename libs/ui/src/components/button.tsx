import * as React from 'react';
import { Slot as SlotPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { NavLink } from 'react-router-dom';
import {
  LuArchive,
  LuArrowLeft,
  LuArrowRight,
  LuCheck,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuDownload,
  LuEye,
  LuMail,
  LuPencil,
  LuPlus,
  LuPrinter,
  LuSearch,
  LuSend,
  LuBan,
  LuTrash2,
  LuUpload,
} from 'react-icons/lu';
import { cn } from '../lib/utils';
import { Spinner } from './spinner';

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        cta: 'bg-cta text-cta-foreground shadow-md shadow-cta/20 hover:bg-cta/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border bg-card shadow-xs hover:bg-accent hover:text-accent-foreground',
        danger: 'border border-destructive/20 bg-destructive/10 text-destructive hover:border-destructive/60',
        destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // Sur fond sombre (bandeaux, footer)
        'outline-light': 'border border-white/40 text-white hover:bg-white/10',
        light: 'bg-white text-primary shadow-md hover:bg-white/90',
      },
      size: {
        default: 'h-10 px-5 has-[>svg]:px-4',
        sm: 'h-9 gap-1.5 px-4 text-xs has-[>svg]:px-3',
        lg: 'h-12 px-7 text-base has-[>svg]:px-6',
        icon: 'size-10',
        'icon-sm': 'size-8',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

// Icônes prêtes à l'emploi : <Button icon="add">Ajouter</Button>
const icons = {
  add: LuPlus,
  edit: LuPencil,
  eye: LuEye,
  download: LuDownload,
  upload: LuUpload,
  delete: LuTrash2,
  suspend: LuBan,
  arrowLeft: LuArrowLeft,
  arrowRight: LuArrowRight,
  check: LuCheck,
  message: LuMail,
  chevronDown: LuChevronDown,
  chevronRight: LuChevronRight,
  chevronLeft: LuChevronLeft,
  print: LuPrinter,
  archive: LuArchive,
  search: LuSearch,
  send: LuSend,
} as const;

export type ButtonIconName = keyof typeof icons;

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: ButtonIconName;
    iconPosition?: 'left' | 'right';
    // Rend un lien React Router stylé en bouton (équivalent à asChild + <Link>)
    link?: string;
    isLoading?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  icon,
  iconPosition = 'left',
  link,
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Icon = icon ? icons[icon] : null;
  const classes = cn(buttonVariants({ variant, size }), className);

  if (link) {
    return (
      <NavLink to={link} data-slot="button" className={classes}>
        {Icon && iconPosition === 'left' && <Icon />}
        {children}
        {Icon && iconPosition === 'right' && <Icon />}
      </NavLink>
    );
  }

  if (asChild) {
    return (
      <SlotPrimitive.Root data-slot="button" className={classes} {...props}>
        {children}
      </SlotPrimitive.Root>
    );
  }

  return (
    <button data-slot="button" className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? <Spinner /> : Icon && iconPosition === 'left' && <Icon />}
      {isLoading ? 'En cours…' : children}
      {!isLoading && Icon && iconPosition === 'right' && <Icon />}
    </button>
  );
}

export { Button, buttonVariants };
