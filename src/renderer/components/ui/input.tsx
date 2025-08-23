import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <input
          type={type}
          className={cn(
            // Base styles
            "flex h-10 w-full rounded-md border px-3 py-2",
            "bg-input text-foreground placeholder:text-muted-foreground",
            "text-sm transition-colors duration-150",
            // Focus styles
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
            // Disabled styles
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Error styles
            error
              ? "border-destructive focus:ring-destructive"
              : "border-border focus:border-ring",
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              "text-xs",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }