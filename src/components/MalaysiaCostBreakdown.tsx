import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { fmtMoney } from '@/components/loanForms'
import { Details } from '@/components/types'
import { malaysiaFeeItems } from '@/lib/malaysia'

// a bordered summary line with a tooltip, used for the totals below the
// itemised breakdown
const SummaryRow: React.FC<{
  label: string
  value: number
  tooltip: string
  bold?: boolean
  className?: string
}> = ({ label, value, tooltip, bold, className }) => (
  <div
    className={`flex items-center justify-between border-t pt-2 ${
      bold ? 'text-base font-semibold' : 'text-sm font-medium'
    } ${className ?? ''}`}
  >
    <span className="flex items-center gap-1">
      {label}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`How ${label} is calculated`}
            className="text-muted-foreground"
          >
            <Info className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">{tooltip}</TooltipContent>
      </Tooltip>
    </span>
    <span className="tabular-nums">{fmtMoney(value)}</span>
  </div>
)

// the estimated Malaysian upfront costs, each with a tooltip explaining how it
// was derived; the final "Estimated Initial Costs" row is emphasised
export const MalaysiaCostBreakdown: React.FC<{ record: Details }> = ({
  record,
}) => {
  const items = malaysiaFeeItems(record)
  if (items.length === 0) {
    return null
  }

  return (
    <div className="mt-2 border-t pt-2">
      <div className="mb-1 text-sm font-medium">Estimated Initial Costs</div>
      <dl className="grid grid-cols-[minmax(10rem,1fr)_auto] gap-y-1 text-sm">
        {items.map((item) => {
          const emphasis =
            item.variant === 'subtotal'
              ? ' mt-1 border-t pt-1 font-medium'
              : item.variant === 'total'
                ? ' mt-1 border-t pt-1 text-base font-semibold'
                : ''
          const labelClass =
            item.variant === undefined ? 'text-muted-foreground' : ''
          return (
            <div
              key={item.label}
              className={
                'col-span-2 grid grid-cols-subgrid items-center' + emphasis
              }
            >
              <dt className={`flex items-center gap-1 ${labelClass}`}>
                {item.label}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={`How ${item.label} is calculated`}
                      className="text-muted-foreground"
                    >
                      <Info className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    {item.tooltip}
                  </TooltipContent>
                </Tooltip>
              </dt>
              <dd className="text-right tabular-nums">
                {fmtMoney(item.value)}
              </dd>
            </div>
          )
        })}
      </dl>

      {record.totalCostOfOwnership !== undefined ? (
        <>
          <SummaryRow
            className="mt-2"
            label="Total Loan Cost"
            value={record.totalLoanCost}
            tooltip="Loan principal, financed mortgage insurance and interest — the total repaid to the bank over the full tenure."
          />
          {/* how the Total Loan Cost is made up */}
          <dl className="grid grid-cols-[minmax(10rem,1fr)_auto] gap-y-1 pt-1 pl-4 text-xs text-muted-foreground">
            {(
              [
                ['Monthly Instalment', fmtMoney(record.monthly)],
                [
                  'Total number of months',
                  fmtMoney(record.loanPeriodYears * 12),
                ],
                ['Mortgage Insurance', fmtMoney(record.mortgageInsurance ?? 0)],
                [
                  'Loan Principal',
                  fmtMoney(record.loanSize - (record.mortgageInsurance ?? 0)),
                ],
                ['Loan Interest', fmtMoney(record.totalInterest)],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label} className="col-span-2 grid grid-cols-subgrid">
                <dt>{label}</dt>
                <dd className="text-right tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <SummaryRow
            className="mt-1"
            label="Total Cost of Ownership"
            value={record.totalCostOfOwnership}
            tooltip="Estimated Total Initial Costs plus Total Loan Cost — the fully-loaded cost."
            bold
          />
        </>
      ) : null}
    </div>
  )
}
