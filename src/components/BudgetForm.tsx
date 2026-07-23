import { Controller, useWatch, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/CopyButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Field, FieldLabel } from '@/components/ui/field'
import { DownPaymentType, Details, BudgetFormDTO } from './types'
import {
  budgetFormToClipboardText,
  fmtMoney,
  toBudgetDTO,
  useBudgetForm,
} from './loanForms'
import { FormNumberField } from './FormNumberField'

interface Props {
  form?: UseFormReturn<BudgetFormDTO>
  initialValues: BudgetFormDTO
  onChange: (values: BudgetFormDTO) => Details
  onFinish: (values: BudgetFormDTO) => void
  disableSubmit?: boolean
}

export const BudgetForm: React.FC<Props> = (props) => {
  const internalForm = useBudgetForm(props.initialValues)
  const form = props.form ?? internalForm

  // useWatch re-renders only this component; form.watch() would re-render
  // the component owning the form (the whole page) on every keystroke
  const values = useWatch({ control: form.control }) as BudgetFormDTO
  const preview = props.onChange(toBudgetDTO(values))

  const downPayment =
    values.downPaymentType === DownPaymentType.FIXED
      ? { name: 'downPaymentFixed' as const, suffix: undefined }
      : { name: 'downPaymentPercentage' as const, suffix: '%' }

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(props.onFinish)}
      className="flex max-w-md flex-col gap-4"
    >
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => (
            <Input id="name" {...field} value={field.value ?? ''} />
          )}
        />
      </Field>

      <FormNumberField control={form.control} name="monthly" label="Monthly" />

      <Field>
        <FieldLabel>Down Payment (Type)</FieldLabel>
        <Controller
          control={form.control}
          name="downPaymentType"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="gap-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value={DownPaymentType.PERCENTAGE}
                  id="downPaymentType-percentage"
                />
                <Label htmlFor="downPaymentType-percentage">Percentage</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value={DownPaymentType.FIXED}
                  id="downPaymentType-fixed"
                />
                <Label htmlFor="downPaymentType-fixed">Fixed</Label>
              </div>
            </RadioGroup>
          )}
        />
      </Field>

      <FormNumberField
        control={form.control}
        name={downPayment.name}
        label="Down Payment"
        suffix={downPayment.suffix}
      />

      <FormNumberField
        control={form.control}
        name="loanPeriodYears"
        label="Loan Period (Years)"
        suffix="years"
      />

      <FormNumberField
        control={form.control}
        name="interestRate"
        label="Interest Rate (%)"
        suffix="%"
      />

      <dl className="grid grid-cols-[10rem_1fr] gap-y-1 text-sm">
        <dt className="text-muted-foreground">Price</dt>
        <dd>{fmtMoney(preview.price)}</dd>
        <dt className="text-muted-foreground">Down Payment</dt>
        <dd>{fmtMoney(preview.downPaymentFixed)}</dd>
        <dt className="text-muted-foreground">Loan Size</dt>
        <dd>{fmtMoney(preview.loanSize)}</dd>
        <dt className="text-muted-foreground">Total Interest</dt>
        <dd>{fmtMoney(preview.totalInterest)}</dd>
        <dt className="text-muted-foreground">Lifetime Cost</dt>
        <dd>{fmtMoney(preview.lifetimeCost)}</dd>
      </dl>

      {props.disableSubmit ? null : (
        <div className="flex gap-2">
          <Button type="submit">Save</Button>
          <CopyButton
            getText={() =>
              budgetFormToClipboardText(toBudgetDTO(values), preview)
            }
          />
        </div>
      )}
    </form>
  )
}
