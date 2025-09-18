import * as React from "react"
import { cn } from '../../../lib/utils'

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  sidebarPosition?: "left" | "right"
}

const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  ({
    className,
    children,
    sidebar,
    header,
    footer,
    sidebarPosition = "left",
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex h-screen bg-background", className)}
        {...props}
      >
        {/* Sidebar Left */}
        {sidebar && sidebarPosition === "left" && sidebar}

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          {header && header}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

          {/* Footer */}
          {footer && footer}
        </div>

        {/* Sidebar Right */}
        {sidebar && sidebarPosition === "right" && sidebar}
      </div>
    )
  }
)
AppShell.displayName = "AppShell"

export interface AppShellMainProps extends React.HTMLAttributes<HTMLElement> {
  padding?: boolean
}

const AppShellMain = React.forwardRef<HTMLElement, AppShellMainProps>(
  ({ className, padding = true, ...props }, ref) => (
    <main
      ref={ref}
      className={cn(
        "flex-1 overflow-y-auto",
        padding && "p-6",
        className
      )}
      {...props}
    />
  )
)
AppShellMain.displayName = "AppShellMain"

export interface AppShellContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  centered?: boolean
}

const containerWidths = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
}

const AppShellContainer = React.forwardRef<HTMLDivElement, AppShellContainerProps>(
  ({ className, maxWidth = "full", centered = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "w-full",
        containerWidths[maxWidth],
        centered && "mx-auto",
        className
      )}
      {...props}
    />
  )
)
AppShellContainer.displayName = "AppShellContainer"

export interface AppShellFooterProps extends React.HTMLAttributes<HTMLElement> {
  bordered?: boolean
}

const AppShellFooter = React.forwardRef<HTMLElement, AppShellFooterProps>(
  ({ className, bordered = true, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(
        "flex h-12 items-center bg-background px-4",
        bordered && "border-t",
        className
      )}
      {...props}
    />
  )
)
AppShellFooter.displayName = "AppShellFooter"

export {
  AppShell,
  AppShellMain,
  AppShellContainer,
  AppShellFooter,
}