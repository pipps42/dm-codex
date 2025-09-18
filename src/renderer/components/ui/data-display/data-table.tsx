import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Check
} from "lucide-react"
import { cn } from '../../../lib/utils'
import { Button } from '../foundation/button'
import { Input } from '../foundation/input'
import { Label } from '../foundation/label'
import { Checkbox } from '../form/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../form/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../feedback/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useTableSorting,
  useTableFiltering
} from './table'

export interface DataTableColumn<T = any> {
  key: string
  header: string
  cell?: (item: T) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: string
}

export interface DataTableProps<T = any> {
  data: T[]
  columns: DataTableColumn<T>[]
  searchPlaceholder?: string
  pageSize?: number
  selectable?: boolean
  onSelectionChange?: (selectedRows: T[]) => void
  onExport?: () => void
  loading?: boolean
  emptyState?: React.ReactNode
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Search...",
  pageSize = 10,
  selectable = false,
  onSelectionChange,
  onExport,
  loading = false,
  emptyState,
  className
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = React.useState(1)

  // Get searchable fields
  const searchFields = React.useMemo(() =>
    columns.filter(col => col.filterable !== false).map(col => col.key),
    [columns]
  )

  // Use table hooks
  const { filteredData, filter, setFilter } = useTableFiltering({
    data,
    searchFields
  })

  const { sortedData, handleSort, getSortDirection } = useTableSorting({
    data: filteredData
  })

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIndexes = new Set(Array.from({ length: paginatedData.length }, (_, i) => i))
      setSelectedRows(allIndexes)
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (index: number, checked: boolean) => {
    const newSelection = new Set(selectedRows)
    if (checked) {
      newSelection.add(index)
    } else {
      newSelection.delete(index)
    }
    setSelectedRows(newSelection)
  }

  // Effect for selection change callback
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedData = Array.from(selectedRows).map(index => paginatedData[index])
      onSelectionChange(selectedData)
    }
  }, [selectedRows, paginatedData, onSelectionChange])

  // Reset pagination when filter changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  // Reset selection when data changes
  React.useEffect(() => {
    setSelectedRows(new Set())
  }, [data])

  const isAllSelected = selectedRows.size === paginatedData.length && paginatedData.length > 0
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < paginatedData.length

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with search and actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          {selectedRows.size > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedRows.size} di {paginatedData.length} righe selezionate
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedRows(new Set())}>
                Deseleziona tutto
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentPage(1)}>
                Prima pagina
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  sortable={column.sortable}
                  sortDirection={getSortDirection(column.key)}
                  onSort={() => handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2">Caricamento...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-24 text-center"
                >
                  {emptyState || (
                    <div className="text-muted-foreground">
                      {filter ? 'Nessun risultato trovato' : 'Nessun dato disponibile'}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={index} data-state={selectedRows.has(index) ? "selected" : undefined}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(index)}
                        onCheckedChange={(checked) => handleSelectRow(index, checked as boolean)}
                        aria-label={`Select row ${index + 1}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.cell ? column.cell(item) : String(item[column.key] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer with pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="page-size" className="text-sm">
              Righe per pagina:
            </Label>
            <Select value={pageSize.toString()} onValueChange={(value) => {
              // This would need to be handled by parent component
              console.log('Page size changed to:', value)
            }}>
              <SelectTrigger className="w-20" id="page-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Pagina {currentPage} di {totalPages} • {sortedData.length} risultati totali
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}