import { useState } from 'react'
import { Eye } from 'lucide-react'
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
import { fmtMoney as money } from '@/components/loanForms'
import {
  amortizationSchedule,
  type AmortizationKind,
  type AmortizationRow,
} from '@/lib/calculations'
import { Details } from '../components/types'
import { detailSections, recordToClipboardText } from './recordText'

interface Props {
  record: Details
  kind: AmortizationKind
}

const COLUMNS: { title: string; render: (row: AmortizationRow) => string }[] = [
  { title: 'Year', render: (row) => row.year },
  { title: 'Month', render: (row) => `${row.month}` },
  { title: 'Interest Paid', render: (row) => money(row.interestPaid) },
  { title: 'Principle Paid', render: (row) => money(row.principlePaid) },
  {
    title: 'Total Interest Paid',
    render: (row) => money(row.totalInterestPaid),
  },
  {
    title: 'Total Principle Paid',
    render: (row) => money(row.totalPrinciplePaid),
  },
  { title: 'Total Paid', render: (row) => money(row.totalPaid) },
  {
    title: 'Remaining Interest',
    render: (row) => money(row.remainingInterest),
  },
  {
    title: 'Remaining Principle',
    render: (row) => money(row.remainingPrinciple),
  },
  {
    title: 'Remaining Lifetime Cost',
    render: (row) => money(row.remainingLifetimeCost),
  },
]

export const ViewButton: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false)

  const record = props.record
  // hundreds of rows per saved record; only build them for an open dialog
  const rows = open ? amortizationSchedule(record, props.kind) : []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" aria-label="View">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>View</DialogTitle>
        </DialogHeader>
        <dl className="grid grid-cols-[14rem_1fr] gap-y-1 text-sm">
          {detailSections(record).map((section, index) => (
            <div
              key={index}
              className={
                'col-span-2 grid grid-cols-subgrid gap-y-1' +
                (index > 0 ? ' mt-2 border-t pt-2' : '')
              }
            >
              {section.map(([label, value]) => (
                <div key={label} className="col-span-2 grid grid-cols-subgrid">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </div>
          ))}
        </dl>
        <div>
          <CopyButton getText={() => recordToClipboardText(record)} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((column) => (
                <TableHead key={column.title} className="text-right">
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key}>
                {COLUMNS.map((column) => (
                  <TableCell key={column.title} className="text-right">
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
