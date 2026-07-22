import { useState } from 'react'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Details } from '@/components/types'

export type LoanTableColumnKey =
  | 'name'
  | 'price'
  | 'sqft'
  | 'pricePerSqft'
  | 'monthly'
  | 'downPaymentFixed'
  | 'loanPeriodYears'
  | 'interestRate'
  | 'loanSize'
  | 'totalInterest'
  | 'totalLoanCost'
  | 'lifetimeCost'
  | 'monthlyInterest'

interface ColumnDef {
  title: string
  numeric?: boolean
  format?: (record: Details) => string
}

const COLUMNS: Record<LoanTableColumnKey, ColumnDef> = {
  name: { title: 'Name' },
  price: { title: 'Price', numeric: true },
  sqft: { title: 'Sqft', numeric: true },
  pricePerSqft: { title: 'Price / Sqft', numeric: true },
  monthly: { title: 'Monthly', numeric: true },
  downPaymentFixed: { title: 'Down Payment', numeric: true },
  loanPeriodYears: { title: 'Loan Period (Years)' },
  interestRate: {
    title: 'Interest Rate',
    numeric: true,
    format: (record) => `${record.interestRate} %`,
  },
  loanSize: { title: 'Loan Size', numeric: true },
  totalInterest: { title: 'Total Interest', numeric: true },
  totalLoanCost: { title: 'Total Loan Cost', numeric: true },
  lifetimeCost: { title: 'Lifetime Cost', numeric: true },
  monthlyInterest: { title: 'Monthly Interest', numeric: true },
}

const renderCell = (key: LoanTableColumnKey, record: Details) => {
  const column = COLUMNS[key]
  if (column.format) {
    return column.format(record)
  }
  const value = record[key]
  if (value === undefined || value === null) {
    return ''
  }
  if (column.numeric) {
    return Number(value).toLocaleString()
  }
  return value
}

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

  const rows = sort
    ? props.dataSource
        .slice(0)
        .sort(
          (a, b) =>
            compare(sort.key, a, b) * (sort.direction === 'asc' ? 1 : -1)
        )
    : props.dataSource

  return (
    <Table>
      <TableHeader>
        <TableRow>
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
  )
}
