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
import { Details } from '../components/types'

interface Props {
  record: Details
}

interface AmortizationRow {
  key: string
  month: number
  year: number
  interestPaid: number
  principlePaid: number
  totalPrinciplePaid: number
  totalPaid: number
  remainingPrinciple: number
  lifetimeCostRemaining: number
}

const COLUMNS: { title: string; render: (row: AmortizationRow) => string }[] = [
  { title: 'Year', render: (row) => `${row.year}` },
  { title: 'Month', render: (row) => `${row.month}` },
  {
    title: 'Interest Paid',
    render: (row) => Number(row.interestPaid).toLocaleString(),
  },
  {
    title: 'Principle Paid',
    render: (row) => Number(row.principlePaid).toLocaleString(),
  },
  {
    title: 'Total Principle Paid',
    render: (row) => Number(row.totalPrinciplePaid).toLocaleString(),
  },
  {
    title: 'Remaining Principle',
    render: (row) => Number(row.remainingPrinciple).toLocaleString(),
  },
  {
    title: 'Total Paid',
    render: (row) => Number(row.totalPaid).toLocaleString(),
  },
  {
    title: 'Remaining Lifetime Cost',
    render: (row) => Number(row.lifetimeCostRemaining).toLocaleString(),
  },
]

export const ViewButton: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false)

  const record = props.record

  const months = record.loanPeriodYears * 12
  const rows: AmortizationRow[] = []

  let totalPrinciplePaid = 0

  const rule78 = (months * (months + 1)) / 2
  for (let i = 0; i < months; i++) {
    const interestPaid = ((months - i) / rule78) * record.totalInterest
    const principlePaid = record.monthly - interestPaid
    totalPrinciplePaid += principlePaid

    rows.push({
      key: `${record.key}:${i}`,
      year: Math.floor(i / 12),
      month: i + 1,
      interestPaid,
      principlePaid,
      totalPrinciplePaid,
      totalPaid: (i + 1) * record.monthly,
      remainingPrinciple: record.price - totalPrinciplePaid,
      lifetimeCostRemaining: record.lifetimeCost - (i + 1) * record.monthly,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" aria-label="View">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>View</DialogTitle>
        </DialogHeader>
        <dl className="grid grid-cols-[14rem_1fr] gap-y-1 text-sm">
          <dt className="text-muted-foreground">Price</dt>
          <dd>{Number(record.price).toLocaleString()}</dd>
          <dt className="text-muted-foreground">Monthly</dt>
          <dd>{Number(record.monthly).toLocaleString()}</dd>
          <dt className="text-muted-foreground">Down Payment</dt>
          <dd>{Number(record.downPaymentFixed).toLocaleString()}</dd>
          <dt className="text-muted-foreground">Loan Period (Years)</dt>
          <dd>{Number(record.loanPeriodYears).toLocaleString()}</dd>
          <dt className="text-muted-foreground">Total Expected Interest</dt>
          <dd>{Number(record.totalInterest).toLocaleString()}</dd>
          <dt className="text-muted-foreground">Expected Lifetime Cost</dt>
          <dd>{Number(record.lifetimeCost).toLocaleString()}</dd>
        </dl>
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
