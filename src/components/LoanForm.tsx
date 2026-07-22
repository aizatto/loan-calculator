import { Controller, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Field, FieldLabel } from '@/components/ui/field'
import { DownPaymentType, Details, LoanFormDTO } from './types'
import { toLoanDTO, useLoanForm } from './loanForms'
import { FormNumberField } from './FormNumberField'

interface Props {
  form?: UseFormReturn<LoanFormDTO>
  initialValues: LoanFormDTO
  onChange: (values: LoanFormDTO) => Details
  onFinish: (values: LoanFormDTO) => void
  disableSubmit?: boolean
}

export const LoanForm: React.FC<Props> = (props) => {
  const internalForm = useLoanForm(props.initialValues)
  const form = props.form ?? internalForm

  const values = form.watch()
  const preview = props.onChange(toLoanDTO(values))

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
          render={({ field: { ref: _ref, ...field } }) => (
            <Input id="name" {...field} value={field.value ?? ''} />
          )}
        />
      </Field>

      <FormNumberField control={form.control} name="price" label="Price" />

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
        <dt className="text-muted-foreground">Monthly</dt>
        <dd>{Number(preview.monthly).toLocaleString()}</dd>
        <dt className="text-muted-foreground">Down Payment</dt>
        <dd>{Number(preview.downPaymentFixed).toLocaleString()}</dd>
        <dt className="text-muted-foreground">Loan Size</dt>
        <dd>{Number(preview.loanSize).toLocaleString()}</dd>
        <dt className="text-muted-foreground">Total Interest</dt>
        <dd>{Number(preview.totalInterest).toLocaleString()}</dd>
        <dt className="text-muted-foreground">Lifetime Cost</dt>
        <dd>{Number(preview.lifetimeCost).toLocaleString()}</dd>
      </dl>

      {props.disableSubmit ? null : (
        <div>
          <Button type="submit">Save</Button>
        </div>
      )}
    </form>
  )
}
