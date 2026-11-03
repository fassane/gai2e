import type { CSSProperties } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { LuCircleAlert, LuCircleCheck, LuInfo, LuLoaderCircle, LuTriangleAlert } from 'react-icons/lu';

// À placer une fois à la racine de l'app : <Toaster />. Déclencher avec toast() ou customToast (./toast).
const Toaster = (props: ToasterProps) => (
  <Sonner
    theme="light"
    className="toaster group"
    icons={{
      success: <LuCircleCheck className="size-5" />,
      info: <LuInfo className="size-5" />,
      warning: <LuTriangleAlert className="size-5" />,
      error: <LuCircleAlert className="size-5" />,
      loading: <LuLoaderCircle className="size-5 animate-spin" />,
    }}
    toastOptions={{
      classNames: {
        toast: 'group-[.toaster]:rounded-2xl! group-[.toaster]:shadow-lg! group-[.toaster]:font-sans',
        success: 'group-[.toaster]:bg-secondary! group-[.toaster]:border-primary/20! group-[.toaster]:text-primary!',
        error:
          'group-[.toaster]:bg-destructive-soft! group-[.toaster]:border-destructive/20! group-[.toaster]:text-destructive!',
        info: 'group-[.toaster]:bg-sky-soft! group-[.toaster]:border-info/20! group-[.toaster]:text-info!',
        warning: 'group-[.toaster]:bg-peach-soft! group-[.toaster]:border-peach/30! group-[.toaster]:text-warning!',
      },
    }}
    style={
      {
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--border)',
        '--border-radius': 'var(--radius)',
      } as CSSProperties
    }
    {...props}
  />
);

export { Toaster };
