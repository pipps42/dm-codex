import * as React from "react"
import { cn } from '../../../lib/utils'
import { Button } from '../foundation/button'

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean
  bordered?: boolean
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, sticky = true, bordered = true, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        "flex h-14 items-center bg-background px-4",
        sticky && "sticky top-0 z-40",
        bordered && "border-b",
        className
      )}
      {...props}
    />
  )
)
Header.displayName = "Header"

export interface HeaderLeftProps extends React.HTMLAttributes<HTMLDivElement> {}

const HeaderLeft = React.forwardRef<HTMLDivElement, HeaderLeftProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
)
HeaderLeft.displayName = "HeaderLeft"

export interface HeaderCenterProps extends React.HTMLAttributes<HTMLDivElement> {}

const HeaderCenter = React.forwardRef<HTMLDivElement, HeaderCenterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-1 items-center justify-center gap-2", className)}
      {...props}
    />
  )
)
HeaderCenter.displayName = "HeaderCenter"

export interface HeaderRightProps extends React.HTMLAttributes<HTMLDivElement> {}

const HeaderRight = React.forwardRef<HTMLDivElement, HeaderRightProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
)
HeaderRight.displayName = "HeaderRight"

export interface HeaderTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const HeaderTitle = React.forwardRef<HTMLHeadingElement, HeaderTitleProps>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
)
HeaderTitle.displayName = "HeaderTitle"

export interface HeaderSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const HeaderSearch = React.forwardRef<HTMLInputElement, HeaderSearchProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="search"
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "max-w-sm",
        className
      )}
      {...props}
    />
  )
)
HeaderSearch.displayName = "HeaderSearch"

export interface HeaderActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const HeaderActions = React.forwardRef<HTMLDivElement, HeaderActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
)
HeaderActions.displayName = "HeaderActions"

export {
  Header,
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
  HeaderTitle,
  HeaderSearch,
  HeaderActions,
}