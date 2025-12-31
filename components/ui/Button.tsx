import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
                    {
                        'bg-white text-black hover:bg-gray-200 focus:ring-white': variant === 'primary',
                        'bg-zinc-800 text-white hover:bg-zinc-700 focus:ring-zinc-800': variant === 'secondary',
                        'border border-zinc-700 bg-transparent hover:bg-zinc-800 text-white': variant === 'outline',
                        'hover:bg-zinc-800 text-zinc-300 hover:text-white': variant === 'ghost',
                        'bg-[var(--brand)] text-black hover:opacity-90 shadow-[0_0_15px_rgba(245,158,11,0.3)]': variant === 'accent',

                        'h-8 px-3 text-xs': size === 'sm',
                        'h-10 px-4 py-2': size === 'md',
                        'h-12 px-6 text-lg': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export { Button, cn };
