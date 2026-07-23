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
  return `${diff > 0 ? '+' : '-'}${fmtMoney(Math.abs(diff))}`
}

export const CompareDialog: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false)

  const base = props.records[0]
  const fieldKeys = props.columns.filter((key) => key !== 'name')
  // show the sqft itself ahead of the derived price per sqft
  if (fieldKeys.includes('pricePerSqft') && !fieldKeys.includes('sqft')) {
    fieldKeys.splice(fieldKeys.indexOf('pricePerSqft'), 0, 'sqft')
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
                          {diff}
                        </div>
                      ) : null}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
