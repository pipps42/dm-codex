import * as React from "react"
import { X } from "lucide-react"
import { cn } from '../../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline"
  size?: "sm" | "md" | "lg"
  removable?: boolean
  onRemove?: () => void
}

const badgeVariants = {
  variant: {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    success: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  },
  size: {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base",
  },
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({
    className,
    variant = "default",
    size = "md",
    removable = false,
    onRemove,
    children,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full font-semibold transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          badgeVariants.variant[variant],
          badgeVariants.size[size],
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {removable && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Remove badge"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    )
  }
)
Badge.displayName = "Badge"

export interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  badges: Array<{
    id: string | number
    label: string
    variant?: BadgeProps['variant']
    removable?: boolean
  }>
  onRemove?: (id: string | number) => void
  maxVisible?: number
}

const BadgeGroup = React.forwardRef<HTMLDivElement, BadgeGroupProps>(
  ({ className, badges, onRemove, maxVisible, ...props }, ref) => {
    const visibleBadges = maxVisible ? badges.slice(0, maxVisible) : badges
    const hiddenCount = maxVisible ? badges.length - maxVisible : 0

    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap items-center gap-1", className)}
        {...props}
      >
        {visibleBadges.map((badge) => (
          <Badge
            key={badge.id}
            variant={badge.variant}
            removable={badge.removable}
            onRemove={onRemove ? () => onRemove(badge.id) : undefined}
          >
            {badge.label}
          </Badge>
        ))}
        {hiddenCount > 0 && (
          <Badge variant="secondary" size="sm">
            +{hiddenCount}
          </Badge>
        )}
      </div>
    )
  }
)
BadgeGroup.displayName = "BadgeGroup"

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'active' | 'inactive' | 'pending' | 'success' | 'error' | 'warning'
  showDot?: boolean
}

const statusVariants = {
  active: { variant: 'success' as const, label: 'Attivo', dotColor: 'bg-green-400' },
  inactive: { variant: 'secondary' as const, label: 'Inattivo', dotColor: 'bg-gray-400' },
  pending: { variant: 'warning' as const, label: 'In Attesa', dotColor: 'bg-yellow-400' },
  success: { variant: 'success' as const, label: 'Successo', dotColor: 'bg-green-400' },
  error: { variant: 'destructive' as const, label: 'Errore', dotColor: 'bg-red-400' },
  warning: { variant: 'warning' as const, label: 'Attenzione', dotColor: 'bg-yellow-400' },
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, showDot = false, children, ...props }, ref) => {
    const statusConfig = statusVariants[status]

    return (
      <Badge
        ref={ref}
        className={className}
        variant={statusConfig.variant}
        {...props}
      >
        {showDot && (
          <span
            className={cn(
              "w-2 h-2 rounded-full mr-1",
              statusConfig.dotColor
            )}
          />
        )}
        {children || statusConfig.label}
      </Badge>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { Badge, BadgeGroup, StatusBadge }