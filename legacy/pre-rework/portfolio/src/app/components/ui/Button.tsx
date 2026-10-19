import * as React from 'react';
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
  size?: 'default' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50',
          variant === 'ghost' ? 'bg-transparent hover:bg-accent' : 'bg-primary text-white hover:bg-primary/90',
          size === 'icon' ? 'h-10 w-10 p-0' : 'h-10 px-4 py-2',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
