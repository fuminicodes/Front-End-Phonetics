import * as React from 'react';
import { cn } from '@/shared/utils/cn';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'destructive';
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'glass-panel glass-text border-white/20 dark:border-white/10',
      info: 'glass-panel border-info-500/30 bg-info-50/50 dark:bg-info-900/20 text-info-700 dark:text-info-300 [&>svg]:text-info-600 dark:[&>svg]:text-info-400',
      success: 'glass-panel border-success-500/30 bg-success-50/50 dark:bg-success-900/20 text-success-700 dark:text-success-300 [&>svg]:text-success-600 dark:[&>svg]:text-success-400',
      warning: 'glass-panel border-warning-500/30 bg-warning-50/50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-800 [&>svg]:text-warning-600 dark:[&>svg]:text-warning-400',
      destructive: 'glass-panel border-danger-500/30 bg-danger-50/50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300 [&>svg]:text-danger-600 dark:[&>svg]:text-danger-400',
    };
    
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative w-full rounded-glass px-4 py-3 text-sm transition-all duration-300',
          '[&>svg+div]:translate-y-[-3px]',
          '[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
          '[&>svg~*]:pl-7',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);

AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-sm [&_p]:leading-relaxed opacity-90', className)}
      {...props}
    />
  )
);

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
export type { AlertProps };