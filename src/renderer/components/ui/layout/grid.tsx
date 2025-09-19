import * as React from "react"
import { cn } from '../../../lib/utils'

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: "sm" | "md" | "lg" | "xl"
  responsive?: boolean
}

const gridVariants = {
  cols: {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    12: "grid-cols-12",
  },
  gap: {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  },
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = "md", responsive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          gridVariants.cols[cols],
          gridVariants.gap[gap],
          responsive && cols > 1 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-" + cols,
          className
        )}
        {...props}
      />
    )
  }
)
Grid.displayName = "Grid"

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col"
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  gap?: "sm" | "md" | "lg" | "xl"
  wrap?: boolean
}

const flexVariants = {
  direction: {
    row: "flex-row",
    col: "flex-col",
  },
  align: {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  },
  justify: {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  },
  gap: {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  },
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({
    className,
    direction = "row",
    align = "start",
    justify = "start",
    gap = "md",
    wrap = false,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          flexVariants.direction[direction],
          flexVariants.align[align],
          flexVariants.justify[justify],
          flexVariants.gap[gap],
          wrap && "flex-wrap",
          className
        )}
        {...props}
      />
    )
  }
)
Flex.displayName = "Flex"

export { Grid, Flex }