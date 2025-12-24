import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GridLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function GridLayout({ children, className }: GridLayoutProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

interface GridItemProps {
  children: ReactNode;
  gridSize?: 1 | 2 | 3 | 4;
  className?: string;
}

export function GridItem({ children, gridSize = 1, className }: GridItemProps) {
  return (
    <div
      className={cn(
        'relative',
        gridSize === 1 && 'col-span-1',
        gridSize === 2 && 'md:col-span-2',
        gridSize === 3 && 'lg:col-span-3',
        gridSize === 4 && 'lg:col-span-4',
        className
      )}
    >
      {children}
    </div>
  );
}
