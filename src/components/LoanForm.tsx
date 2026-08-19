import { Controller, useWatch, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/CopyButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Field, FieldLabel } from '@/components/ui/field'
import { DownPaymentType, Details, LoanFormDTO } from './types'
import {
  fmtMoney,
  formToClipboardText,
  toLoanDTO,
  useLoanForm,
} from './loanForms'
import { FormNumberField } from './FormNumberField'
import { MalaysiaCostBreakdown } from './MalaysiaCostBreakdown'

interface Props {
  form?: UseFormReturn<LoanFormDTO>
  initialValues: LoanFormDTO
  onChange: (values: LoanFormDTO) => Details
  onFinish: (values: LoanFormDTO) => void
  disableSubmit?: boolean
  showCopy?: boolean
  showSqft?: boolean
  showMortgageInsurance?: boolean
  showAdditionalFees?: boolean
}

export const LoanForm: React.FC<Props> = (props) => {
  const internalForm = useLoanForm(props.initialValues)
  const form = props.form ?? internalForm

  // useWatch re-renders only this component; form.watch() would re-render
  // the component owning the form (the whole page) on every keystroke
  const values = useWatch({ control: form.control }) as LoanFormDTO
  const preview = props.onChange(toLoanDTO(values))

  const downPayment =
    values.downPaymentType === DownPaymentType.FIXED
      ? { name: 'downPaymentFixed' as const, suffix: undefined }
      : { name: 'downPaymentPercentage' as const, suffix: '%' }

  const mortgageInsurance =
    values.mortgageInsuranceType === DownPaymentType.FIXED
      ? { name: 'mortgageInsuranceFixed' as const, suffix: undefined }
      : { name: 'mortgageInsuranceRate' as const, suffix: '%' }

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

      <FormNumberField control={form.control} name="price" label="Price" />

      {props.showSqft ? (
        <FormNumberField
          control={form.control}
          name="sqft"
          label="Sqft (optional)"
        />
      ) : null}

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

      {props.showMortgageInsurance ? (
        <>
          <Field>
            <FieldLabel>Mortgage Insurance (Type)</FieldLabel>
            <Controller
              control={form.control}
              name="mortgageInsuranceType"
              render={({ field }) => (
                <RadioGroup
                  value={field.value ?? DownPaymentType.PERCENTAGE}
                  onValueChange={field.onChange}
                  className="gap-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value={DownPaymentType.PERCENTAGE}
                      id="mortgageInsuranceType-percentage"
                    />
                    <Label htmlFor="mortgageInsuranceType-percentage">
                      Percentage
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value={DownPaymentType.FIXED}
                      id="mortgageInsuranceType-fixed"
                    />
                    <Label htmlFor="mortgageInsuranceType-fixed">Fixed</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </Field>

          <FormNumberField
            control={form.control}
            name={mortgageInsurance.name}
            label="Mortgage Insurance"
            suffix={mortgageInsurance.suffix}
          />
        </>
      ) : null}

      {props.showAdditionalFees ? (
        <FormNumberField
          control={form.control}
          name="additionalInitialCosts"
          label="Additional Initial Costs (optional)"
        />
      ) : null}

      <dl className="grid grid-cols-[10rem_1fr] gap-y-1 text-sm">
        <dt className="text-muted-foreground">Monthly</dt>
        <dd>{fmtMoney(preview.monthly)}</dd>
        <dt className="text-muted-foreground">Down Payment</dt>
        <dd>{fmtMoney(preview.downPaymentFixed)}</dd>
        {preview.mortgageInsurance !== undefined ? (
          <>
            <dt className="text-muted-foreground">Mortgage Insurance</dt>
            <dd>{fmtMoney(preview.mortgageInsurance)}</dd>
          </>
        ) : null}
        <dt className="text-muted-foreground">Loan Size</dt>
        <dd>{fmtMoney(preview.loanSize)}</dd>
        <dt className="text-muted-foreground">Total Interest</dt>
        <dd>{fmtMoney(preview.totalInterest)}</dd>
        {/* Total Loan Cost (loan size + interest) shown alongside the Malaysian
            costs; it equals the total payment over the tenure */}
        {preview.totalCostOfOwnership !== undefined ? (
          <>
            <dt className="text-muted-foreground">Total Loan Cost</dt>
            <dd>{fmtMoney(preview.totalLoanCost)}</dd>
          </>
        ) : null}
        {/* Lifetime Cost is superseded by Total Cost of Ownership when the
            Malaysian upfront costs are included */}
        {preview.totalCostOfOwnership === undefined ? (
          <>
            <dt className="text-muted-foreground">Lifetime Cost</dt>
            <dd>{fmtMoney(preview.lifetimeCost)}</dd>
          </>
        ) : null}
        {preview.pricePerSqft !== undefined ? (
          <>
            <dt className="text-muted-foreground">Price / Sqft</dt>
            <dd>{fmtMoney(preview.pricePerSqft)}</dd>
          </>
        ) : null}
      </dl>

      <MalaysiaCostBreakdown record={preview} />

      {props.disableSubmit && !props.showCopy ? null : (
        <div className="flex gap-2">
          {props.disableSubmit ? null : <Button type="submit">Save</Button>}
          {props.showCopy ? (
            <CopyButton
              getText={() => formToClipboardText(toLoanDTO(values), preview)}
            />
          ) : null}
        </div>
      )}
    </form>
  )
}
