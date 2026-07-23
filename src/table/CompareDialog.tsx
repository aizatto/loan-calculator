import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CopyButton } from '@/components/CopyButton'
import { fmtMoney } from '@/components/loanForms'
import { Details } from '@/components/types'
import { COLUMNS, renderCell, type LoanTableColumnKey } from './columns'

interface Props {
  // in selection order; the first record is the baseline
  records: Details[]
  columns: LoanTableColumnKey[]
  disabled?: boolean
}

const delta = (key: LoanTableColumnKey, base: Details, record: Details) => {
  const from = Number(base[key])
  const to = Number(record[key])
  if (!Number.isFinite(from) || !Number.isFinite(to)) {
    return null
  }
  const diff = to - from
  if (diff === 0) {
    return null
  }
  const sign = diff > 0 ? '+' : '-'
  const amount = `${sign}${fmtMoney(Math.abs(diff))}`
  const percent =
    from !== 0 ? `${sign}${Math.abs((diff / from) * 100).toFixed(1)}%` : null
  return { amount, percent }
}

export const CompareDialog: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false)

  const base = props.records[0]
  const fieldKeys = props.columns.filter((key) => key !== 'name')
  // show the sqft itself ahead of the derived price per sqft
  if (fieldKeys.includes('pricePerSqft') && !fieldKeys.includes('sqft')) {
    fieldKeys.splice(fieldKeys.indexOf('pricePerSqft'), 0, 'sqft')
  }

  const columnLabel = (record: Details, index: number) =>
    (record.name || `Row ${index + 1}`) + (index === 0 ? ' (base)' : '')

  const toMarkdown = () => {
    const headerCells = ['Field', ...props.records.map(columnLabel)]
    const bodyRows = fieldKeys.map((key) => [
      COLUMNS[key].title,
      ...props.records.map((record, index) => {
        const value = String(renderCell(key, record))
        const diff = index > 0 ? delta(key, base, record) : null
        if (!diff) {
          return value
        }
        return `${value} (${diff.amount}${
          diff.percent ? `, ${diff.percent}` : ''
        })`
      }),
    ])

    // pad every column to its widest cell so the raw text lines up;
    // the field column is left-aligned, value columns right-aligned
    const widths = headerCells.map((header, col) =>
      Math.max(header.length, 3, ...bodyRows.map((row) => row[col].length))
    )
    const pad = (cell: string, col: number) =>
      col === 0 ? cell.padEnd(widths[col]) : cell.padStart(widths[col])
    const line = (cells: string[]) => `| ${cells.map(pad).join(' | ')} |`
    const separator = `| ${widths
      .map((width, col) =>
        col === 0 ? '-'.repeat(width) : '-'.repeat(width - 1) + ':'
      )
      .join(' | ')} |`

    return [line(headerCells), separator, ...bodyRows.map(line)].join('\n')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={props.disabled}>
          Compare ({props.records.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Compare</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              {props.records.map((record, index) => (
                <TableHead key={record.key} className="text-right">
                  {record.name || `Row ${index + 1}`}
                  {index === 0 ? (
                    <span className="ml-1 font-normal text-muted-foreground">
                      (base)
                    </span>
                  ) : null}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {fieldKeys.map((key) => (
              <TableRow key={key}>
                <TableCell className="text-muted-foreground">
                  {COLUMNS[key].title}
                </TableCell>
                {props.records.map((record, index) => {
                  const diff = index > 0 ? delta(key, base, record) : null
                  return (
                    <TableCell key={record.key} className="text-right">
                      <div>{renderCell(key, record)}</div>
                      {diff ? (
                        <div className="text-xs text-muted-foreground">
                          {diff.amount}
                          {diff.percent ? ` (${diff.percent})` : ''}
                        </div>
                      ) : null}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div>
          <CopyButton label="Copy as Markdown" getText={toMarkdown} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
