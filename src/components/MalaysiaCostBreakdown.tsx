import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { fmtMoney } from '@/components/loanForms'
import { Details } from '@/components/types'
import { malaysiaFeeItems } from '@/lib/malaysia'

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
        {items.map((item, index) => {
          const isTotal = index === items.length - 1
          return (
            <div
              key={item.label}
              className={
                'col-span-2 grid grid-cols-subgrid items-center' +
                (isTotal ? ' mt-1 border-t pt-1 font-medium' : '')
              }
            >
              <dt className="flex items-center gap-1 text-muted-foreground">
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
    </div>
  )
}
