import * as React from "react"
import { cn } from '../../../lib/utils'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "success" | "warning" | "destructive"
  showValue?: boolean
  animated?: boolean
  striped?: boolean
}

const progressVariants = {
  size: {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  },
  variant: {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    destructive: "bg-destructive",
  },
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({
    className,
    value,
    max = 100,
    size = "md",
    variant = "default",
    showValue = false,
    animated = false,
    striped = false,
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div className="space-y-1">
        <div
          ref={ref}
          className={cn(
            "w-full overflow-hidden rounded-full bg-muted",
            progressVariants.size[size],
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "h-full transition-all duration-300 ease-in-out",
              progressVariants.variant[variant],
              striped && "bg-stripe",
              animated && "animate-pulse"
            )}
            style={{
              width: `${percentage}%`,
              backgroundImage: striped ?
                "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)" :
                undefined,
              backgroundSize: striped ? "1rem 1rem" : undefined,
            }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemax={max}
            aria-valuemin={0}
          />
        </div>
        {showValue && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(percentage)}%</span>
            <span>{value} / {max}</span>
          </div>
        )}
      </div>
    )
  }
)
Progress.displayName = "Progress"

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  variant?: "default" | "success" | "warning" | "destructive"
  showValue?: boolean
  animated?: boolean
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({
    className,
    value,
    max = 100,
    size = 80,
    strokeWidth = 6,
    variant = "default",
    showValue = false,
    animated = false,
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    const colorVariants = {
      default: "stroke-primary",
      success: "stroke-green-500",
      warning: "stroke-yellow-500",
      destructive: "stroke-destructive",
    }

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted stroke-current opacity-20"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-300 ease-in-out",
              colorVariants[variant],
              animated && "animate-pulse"
            )}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium">{Math.round(percentage)}%</span>
          </div>
        )}
      </div>
    )
  }
)
CircularProgress.displayName = "CircularProgress"

export interface HealthBarProps extends React.HTMLAttributes<HTMLDivElement> {
  current: number
  max: number
  temporary?: number
  showNumbers?: boolean
  size?: "sm" | "md" | "lg"
}

const HealthBar = React.forwardRef<HTMLDivElement, HealthBarProps>(
  ({
    className,
    current,
    max,
    temporary = 0,
    showNumbers = true,
    size = "md",
    ...props
  }, ref) => {
    const currentPercentage = Math.min(Math.max((current / max) * 100, 0), 100)
    const tempPercentage = Math.min(Math.max(((current + temporary) / max) * 100, 0), 100)

    const getHealthColor = () => {
      const healthRatio = current / max
      if (healthRatio > 0.7) return "bg-green-500"
      if (healthRatio > 0.3) return "bg-yellow-500"
      return "bg-red-500"
    }

    return (
      <div ref={ref} className={cn("space-y-1", className)} {...props}>
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-muted",
            progressVariants.size[size]
          )}
        >
          {/* Base health bar */}
          <div
            className={cn("h-full transition-all duration-300", getHealthColor())}
            style={{ width: `${currentPercentage}%` }}
          />

          {/* Temporary HP overlay */}
          {temporary > 0 && (
            <div
              className="absolute top-0 h-full bg-blue-400 opacity-70"
              style={{
                left: `${currentPercentage}%`,
                width: `${tempPercentage - currentPercentage}%`
              }}
            />
          )}
        </div>

        {showNumbers && (
          <div className="flex justify-between text-xs">
            <span className="font-medium">
              {current}{temporary > 0 && ` (+${temporary})`} HP
            </span>
            <span className="text-muted-foreground">/ {max}</span>
          </div>
        )}
      </div>
    )
  }
)
HealthBar.displayName = "HealthBar"

export interface SkillProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  skills: Array<{
    name: string
    value: number
    max: number
    color?: string
  }>
  orientation?: "horizontal" | "vertical"
}

const SkillProgress = React.forwardRef<HTMLDivElement, SkillProgressProps>(
  ({ className, skills, orientation = "horizontal", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "space-y-3",
          orientation === "vertical" && "flex flex-col space-y-3 space-x-0",
          orientation === "horizontal" && "space-y-3",
          className
        )}
        {...props}
      >
        {skills.map((skill, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{skill.name}</span>
              <span className="text-muted-foreground">{skill.value}/{skill.max}</span>
            </div>
            <Progress
              value={skill.value}
              max={skill.max}
              variant="default"
              size="sm"
              className={skill.color ? `bg-muted [&>div]:${skill.color}` : undefined}
            />
          </div>
        ))}
      </div>
    )
  }
)
SkillProgress.displayName = "SkillProgress"

export { Progress, CircularProgress, HealthBar, SkillProgress }