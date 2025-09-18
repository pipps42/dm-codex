import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from '../../../lib/utils'
import { Button } from '../foundation/button'

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-4 pb-4", className)}
      {...props}
    />
  )
)
PageHeader.displayName = "PageHeader"

export interface PageHeaderTopProps extends React.HTMLAttributes<HTMLDivElement> {}

const PageHeaderTop = React.forwardRef<HTMLDivElement, PageHeaderTopProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between", className)}
      {...props}
    />
  )
)
PageHeaderTop.displayName = "PageHeaderTop"

export interface PageHeaderLeftProps extends React.HTMLAttributes<HTMLDivElement> {}

const PageHeaderLeft = React.forwardRef<HTMLDivElement, PageHeaderLeftProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
)
PageHeaderLeft.displayName = "PageHeaderLeft"

export interface PageHeaderRightProps extends React.HTMLAttributes<HTMLDivElement> {}

const PageHeaderRight = React.forwardRef<HTMLDivElement, PageHeaderRightProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
)
PageHeaderRight.displayName = "PageHeaderRight"

export interface PageHeaderTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const PageHeaderTitle = React.forwardRef<HTMLHeadingElement, PageHeaderTitleProps>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn("text-2xl font-bold tracking-tight", className)}
      {...props}
    />
  )
)
PageHeaderTitle.displayName = "PageHeaderTitle"

export interface PageHeaderDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const PageHeaderDescription = React.forwardRef<HTMLParagraphElement, PageHeaderDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
)
PageHeaderDescription.displayName = "PageHeaderDescription"

export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, separator = <ChevronRight className="h-4 w-4" />, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm", className)}
      {...props}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-muted-foreground">{separator}</span>
          )}
          {item.href || item.onClick ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-sm font-normal text-muted-foreground hover:text-foreground"
              onClick={item.onClick}
            >
              {item.label}
            </Button>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
)
Breadcrumb.displayName = "Breadcrumb"

export interface PageHeaderActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const PageHeaderActions = React.forwardRef<HTMLDivElement, PageHeaderActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
)
PageHeaderActions.displayName = "PageHeaderActions"

export {
  PageHeader,
  PageHeaderTop,
  PageHeaderLeft,
  PageHeaderRight,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  Breadcrumb,
}