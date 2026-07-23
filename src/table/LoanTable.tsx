import { useState } from 'react'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Details } from '@/components/types'
import { CompareDialog } from './CompareDialog'
import { COLUMNS, renderCell, type LoanTableColumnKey } from './columns'

export type { LoanTableColumnKey }

const compare = (key: LoanTableColumnKey, a: Details, b: Details): number => {
  if (key === 'name') {
    return a.name?.localeCompare(b.name ?? '') ?? 0
  }
  return Number(a[key]) - Number(b[key])
}

type SortDirection = 'asc' | 'desc'

interface Sort {
  key: LoanTableColumnKey
  direction: SortDirection
}

interface Props {
  columns: LoanTableColumnKey[]
  dataSource: Details[]
  sortable?: boolean
  actions?: (record: Details) => React.ReactNode
}

export const LoanTable: React.FC<Props> = (props) => {
  const [sort, setSort] = useState<Sort | null>(null)
  // record keys in the order they were selected; the first is the
  // comparison baseline
  const [selected, setSelected] = useState<string[]>([])

  // antd's sorter cycles ascending -> descending -> off on header clicks
  const cycleSort = (key: LoanTableColumnKey) => {
    setSort((current) => {
      if (current?.key !== key) {
        return { key, direction: 'asc' }
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' }
      }
      return null
    })
  }

  const toggleSelected = (key: string) => {
    setSelected((current) =>
      current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key]
    )
  }

  const rows = sort
    ? props.dataSource
        .slice(0)
        .sort(
          (a, b) =>
            compare(sort.key, a, b) * (sort.direction === 'asc' ? 1 : -1)
        )
    : props.dataSource

  const selectedRecords = selected
    .map((key) => props.dataSource.find((record) => record.key === key))
    .filter((record): record is Details => record !== undefined)

  return (
    <div className="flex flex-col gap-2">
      {selectedRecords.length > 0 ? (
        <div className="flex items-center gap-2">
          <CompareDialog
            records={selectedRecords}
            columns={props.columns}
            disabled={selectedRecords.length < 2}
          />
          <span className="text-sm text-muted-foreground">
            {selectedRecords.length} selected
            {selectedRecords.length < 2
              ? ' — select at least 2 to compare'
              : ''}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setSelected([])}>
            Clear
          </Button>
        </div>
      ) : null}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            {props.columns.map((key) => {
              const column = COLUMNS[key]
              return (
                <TableHead
                  key={key}
                  className={column.numeric ? 'text-right' : undefined}
                >
                  {props.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-mx-2.5"
                      onClick={() => cycleSort(key)}
                    >
                      {column.title}
                      {sort?.key === key ? (
                        sort.direction === 'asc' ? (
                          <ArrowUp />
                        ) : (
                          <ArrowDown />
                        )
                      ) : (
                        <ChevronsUpDown className="opacity-50" />
                      )}
                    </Button>
                  ) : (
                    column.title
                  )}
                </TableHead>
              )
            })}
            {props.actions ? <TableHead>Action</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((record) => (
            <TableRow key={record.key}>
              <TableCell>
                <Checkbox
                  aria-label="Select row"
                  checked={selected.includes(record.key)}
                  onCheckedChange={() => toggleSelected(record.key)}
                />
              </TableCell>
              {props.columns.map((key) => (
                <TableCell
                  key={key}
                  className={COLUMNS[key].numeric ? 'text-right' : undefined}
                >
                  {renderCell(key, record)}
                </TableCell>
              ))}
              {props.actions ? (
                <TableCell>
                  <div className="flex gap-2">{props.actions(record)}</div>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
