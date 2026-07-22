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
import {
  amortizationSchedule,
  type AmortizationKind,
  type AmortizationRow,
} from '@/lib/calculations'
import { Details, DownPaymentType } from '../components/types'

interface Props {
  record: Details
  kind: AmortizationKind
}

// snap floating point residue (e.g. -1e-10 rendering as "-0") to zero
const money = (value: number) =>
  (Math.abs(value) < 0.0005 ? 0 : value).toLocaleString()

// every field and computed value of a saved row, driving both the summary
// list in the dialog and its copy button
const detailRows = (record: Details): [string, string][] => [
  ['Name', record.name ?? ''],
  ['Price', money(record.price)],
  ...(record.sqft
    ? ([
        ['Sqft', money(record.sqft)],
        [
          'Price / Sqft',
          money(record.pricePerSqft ?? record.price / record.sqft),
        ],
      ] as [string, string][])
    : []),
  ['Monthly', money(record.monthly)],
  ['Down Payment (Type)', record.downPaymentType],
  ...(record.downPaymentType === DownPaymentType.PERCENTAGE
    ? ([['Down Payment (%)', `${record.downPaymentPercentage} %`]] as [
        string,
        string,
      ][])
    : []),
  ['Down Payment', money(record.downPaymentFixed)],
  ['Loan Period (Years)', `${record.loanPeriodYears} years`],
  ['Interest Rate', `${record.interestRate} %`],
  ['Loan Size', money(record.loanSize)],
  ['Total Interest', money(record.totalInterest)],
  ['Total Loan Cost', money(record.totalLoanCost)],
  ['Lifetime Cost', money(record.lifetimeCost)],
  ['Monthly Interest', money(record.monthlyInterest)],
]

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
  const rows = amortizationSchedule(record, props.kind)

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
          {detailRows(record).map(([label, value]) => (
            <div key={label} className="col-span-2 grid grid-cols-subgrid">
              <dt className="text-muted-foreground">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div>
          <CopyButton
            getText={() =>
              detailRows(record)
                .map(([label, value]) => `${label}: ${value}`)
                .join('\n')
            }
          />
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
