import { forwardRef } from 'react';
import { cn } from './Button';
import { motion, type HTMLMotionProps } from 'motion/react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean };
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        <input
          ref={ref}
          className={cn(
            "bg-surface-container-lowest text-on-surface w-full px-4 py-4 placeholder:text-on-surface-variant/50 focus:outline-none transition-all border-b-2 border-on-surface/10",
            error ? "border-error focus:border-error" : "focus:border-primary",
            className
          )}
          {...props}
        />
        <motion.div 
          className="absolute bottom-0 left-0 h-[2px] bg-primary origin-left"
          initial={{ scaleX: 0 }}
          whileFocus={{ scaleX: 1 }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        <textarea
          ref={ref}
          className={cn(
            "bg-surface-container-lowest text-on-surface w-full px-4 py-4 placeholder:text-on-surface-variant/50 focus:outline-none transition-all border-b-2 border-on-surface/10 min-h-[140px] resize-none",
            error ? "border-error focus:border-error" : "focus:border-primary",
            className
          )}
          {...props}
        />
        <motion.div 
          className="absolute bottom-0 left-0 h-[2px] bg-primary origin-left"
          initial={{ scaleX: 0 }}
          whileFocus={{ scaleX: 1 }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        />
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
