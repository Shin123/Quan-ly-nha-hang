'use client'

import { Input } from '@/components/ui/input'
import { useSearchParams } from 'next/navigation'
import AddEmployee from './add-emloyee'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AccountListResType,
  AccountType,
} from '@/schemaValidations/account.schema'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { createContext, useEffect, useState } from 'react'

type AccountItem = AccountListResType['data'][0]

const AccountTableContext = createContext<{
  setEmployeeIdEdit: (value: number) => void
  employeeIdEdit: number | undefined
  employeeDelete: AccountItem | null
  setEmployeeDelete: (value: AccountItem | null) => void
}>({
  setEmployeeIdEdit: (value: number | undefined) => {},
  employeeIdEdit: undefined,
  employeeDelete: null,
  setEmployeeDelete: (value: AccountItem | null) => {},
})

export const columns: ColumnDef<AccountType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
]

const PAGE_SIZE = 10
export default function AccountTable() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1
  const pageIndex = page - 1

  const [employeeIdEdit, setEmployeeIdEdit] = useState<number | undefined>()
  const [employeeDelete, setEmployeeDelete] = useState<AccountItem | null>(null)

  const data: any[] = []
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE,
  })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    })
  }, [table, pageIndex])

  return (
    <AccountTableContext.Provider
      value={{
        employeeIdEdit,
        setEmployeeIdEdit,
        employeeDelete,
        setEmployeeDelete,
      }}
    >
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input placeholder="Filter emails..." className="max-w-sm" />
          <div className="ml-auto flex items-center gap-2">
            <AddEmployee />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHeader key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHeader>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AccountTableContext.Provider>
  )
}
