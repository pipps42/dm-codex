import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center',
          className
        )}
        {...props}
      >
        <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      </div>
    )
  }
)
LoadingSpinner.displayName = 'LoadingSpinner'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-md bg-muted',
          className
        )}
        {...props}
      />
    )
  }
)
Skeleton.displayName = 'Skeleton'

interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean
  children: React.ReactNode
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ className, isLoading, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        {children}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <LoadingSpinner size="lg" />
          </div>
        )}
      </div>
    )
  }
)
LoadingOverlay.displayName = 'LoadingOverlay'

export { LoadingSpinner, Skeleton, LoadingOverlay }