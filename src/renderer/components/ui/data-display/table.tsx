import * as React from "react"
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react"
import { cn } from '../../../lib/utils'
import { Button } from '../foundation/button'

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
  sortDirection?: 'asc' | 'desc' | null
  onSort?: () => void
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable = false, sortDirection, onSort, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        sortable && "cursor-pointer select-none hover:bg-muted/50",
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      {sortable ? (
        <div className="flex items-center gap-2">
          <span>{children}</span>
          {sortDirection === 'asc' && <ChevronUp className="w-4 h-4" />}
          {sortDirection === 'desc' && <ChevronDown className="w-4 h-4" />}
          {sortDirection === null && <ArrowUpDown className="w-4 h-4 opacity-50" />}
        </div>
      ) : (
        children
      )}
    </th>
  )
)
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export interface TableFilterProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFilterChange?: (value: string) => void
}

const TableFilter = React.forwardRef<HTMLInputElement, TableFilterProps>(
  ({ className, onFilterChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onFilterChange?.(e.target.value)
    }

    return (
      <input
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
TableFilter.displayName = "TableFilter"

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

export interface UseTableSortingProps {
  data: any[]
  defaultSort?: SortConfig
}

export function useTableSorting({ data, defaultSort }: UseTableSortingProps) {
  const [sortConfig, setSortConfig] = React.useState<SortConfig | null>(defaultSort || null)

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [data, sortConfig])

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'

    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    setSortConfig({ key, direction })
  }

  const getSortDirection = (key: string): 'asc' | 'desc' | null => {
    if (sortConfig?.key === key) {
      return sortConfig.direction
    }
    return null
  }

  return {
    sortedData,
    handleSort,
    getSortDirection,
    sortConfig
  }
}

export interface UseTableFilteringProps {
  data: any[]
  searchFields: string[]
}

export function useTableFiltering({ data, searchFields }: UseTableFilteringProps) {
  const [filter, setFilter] = React.useState('')

  const filteredData = React.useMemo(() => {
    if (!filter) return data

    const lowercaseFilter = filter.toLowerCase()

    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field]
        if (value == null) return false
        return String(value).toLowerCase().includes(lowercaseFilter)
      })
    )
  }, [data, filter, searchFields])

  return {
    filteredData,
    filter,
    setFilter
  }
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableFilter,
}