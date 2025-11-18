import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      {children}
    </div>
  );
}

export function PageContainer({ children, className }: LayoutProps) {
  return (
    <div className={cn('page-container', className)}>
      {children}
    </div>
  );
}

export function Section({ children, className }: LayoutProps) {
  return (
    <section className={cn('py-12 md:py-16', className)}>
      {children}
    </section>
  );
}

