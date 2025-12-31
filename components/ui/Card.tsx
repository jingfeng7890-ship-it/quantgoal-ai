import { HTMLAttributes, forwardRef } from 'react';
import { cn } from './Button'; // Reuse cn

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'glass-card rounded-xl p-6 text-card-foreground shadow-sm',
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = 'Card';

export { Card };
