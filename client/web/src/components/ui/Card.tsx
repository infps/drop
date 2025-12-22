'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        hoverable && 'hover:shadow-md hover:border-gray-300 transition-all cursor-pointer',
        className
      )}
      {...props}
    />
  )
);

Card.displayName = 'Card';

export default Card;
