import { forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, type HTMLMotionProps } from 'motion/react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ 
          scale: 1.02, 
          y: -2,
          transition: { duration: 0.2, ease: [0.76, 0, 0.24, 1] }
        }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center font-display font-bold uppercase tracking-wider px-8 py-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:pointer-events-none transition-colors duration-200",
          variant === 'primary' && "bg-gradient-to-r from-primary to-primary-dark text-on-primary shadow-lg shadow-primary/20",
          variant === 'secondary' && "bg-transparent text-on-surface ring-1 ring-on-surface/15 hover:bg-surface-container-low",
          variant === 'ghost' && "bg-transparent text-on-surface hover:bg-surface-container-low",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
