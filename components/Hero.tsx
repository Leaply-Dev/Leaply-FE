'use client';

import { ReactNode } from 'react';
import { SlideUp } from './PageTransition';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  children?: ReactNode;
  className?: string;
}

export function Hero({ title, subtitle, children, className }: HeroProps) {
  return (
    <section
      className={cn(
        'relative bg-linear-to-br from-leaf-green/10 via-light-green/5 to-white py-20 md:py-32',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <SlideUp>
            {typeof title === 'string' ? (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                {title}
              </h1>
            ) : (
              title
            )}
          </SlideUp>

          {subtitle && (
            <SlideUp delay={0.1}>
              {typeof subtitle === 'string' ? (
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              ) : (
                subtitle
              )}
            </SlideUp>
          )}

          {children && <SlideUp delay={0.2}>{children}</SlideUp>}
        </div>
      </div>
    </section>
  );
}

