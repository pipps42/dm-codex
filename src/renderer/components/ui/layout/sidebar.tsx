import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from '../../../lib/utils'
import { Button } from '../foundation/button'
import { ScrollArea } from './scroll-area'

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  collapsible?: boolean
  position?: "left" | "right"
  width?: string
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({
    className,
    children,
    collapsed = false,
    onCollapsedChange,
    collapsible = true,
    position = "left",
    width = "w-64",
    ...props
  }, ref) => {
    const handleToggle = () => {
      onCollapsedChange?.(!collapsed)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col border-r bg-background transition-all duration-200",
          collapsed ? "w-16" : width,
          position === "right" && "border-r-0 border-l order-last",
          className
        )}
        {...props}
      >
        {collapsible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className={cn(
              "absolute top-4 z-10 h-8 w-8 rounded-full border bg-background shadow-sm",
              position === "left" ? "-right-4" : "-left-4"
            )}
          >
            {position === "left" ? (
              collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
            ) : (
              collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}

        <ScrollArea className="flex-1">
          {children}
        </ScrollArea>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex h-14 items-center border-b px-4", className)}
      {...props}
    />
  )
)
SidebarHeader.displayName = "SidebarHeader"

export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto p-4", className)}
      {...props}
    />
  )
)
SidebarContent.displayName = "SidebarContent"

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-t p-4", className)}
      {...props}
    />
  )
)
SidebarFooter.displayName = "SidebarFooter"

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

const SidebarNav = React.forwardRef<HTMLElement, SidebarNavProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn("space-y-1", className)}
      {...props}
    />
  )
)
SidebarNav.displayName = "SidebarNav"

export interface SidebarNavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  icon?: React.ReactNode
}

const SidebarNavItem = React.forwardRef<HTMLButtonElement, SidebarNavItemProps>(
  ({ className, children, active = false, icon, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium",
        "transition-colors hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  )
)
SidebarNavItem.displayName = "SidebarNavItem"

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
}

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, title, children, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {title && (
        <h4 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h4>
      )}
      {children}
    </div>
  )
)
SidebarGroup.displayName = "SidebarGroup"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarNav,
  SidebarNavItem,
  SidebarGroup,
}