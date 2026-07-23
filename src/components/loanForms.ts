import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { BudgetFormDTO, Details, DownPaymentType, LoanFormDTO } from './types'

// HTML number inputs yield strings (and '' when cleared); antd's InputNumber
// yielded numbers. Coerce on validation so the DTOs keep their exact shape,
// and treat an empty input as missing so the required message fires.
const requiredNumber = (message: string) =>
  z.preprocess(
    (value) => (value === '' || value === null ? undefined : value),
    z.coerce.number({ error: message })
  )

const optionalNumber = () =>
  z.preprocess(
    (value) => (value === '' || value === null ? undefined : value),
    z.coerce.number().optional()
  )

const baseFormSchema = {
  name: z.string().optional(),
  downPaymentType: z.enum(DownPaymentType),
  downPaymentFixed: requiredNumber('Please input your Down Payment'),
  downPaymentPercentage: requiredNumber('Please input your Down Payment'),
  loanPeriodYears: requiredNumber('Please input your Loan Period'),
  interestRate: requiredNumber('Please input your Interest Rate'),
}

export const loanFormSchema = z.object({
  ...baseFormSchema,
  price: requiredNumber('Please input your Price'),
  sqft: optionalNumber(),
})

export const budgetFormSchema = z.object({
  ...baseFormSchema,
  monthly: requiredNumber('Please input your Monthly Budget'),
})

// Form state can briefly hold strings while the user types; these produce a
// fresh, fully numeric DTO (calculateLoan and friends mutate their argument,
// so never hand them live form state).
export const toLoanDTO = (values: LoanFormDTO): LoanFormDTO => ({
  name: values.name,
  price: Number(values.price),
  // sqft is optional; an empty input must stay undefined, not become 0
  sqft: values.sqft ? Number(values.sqft) : undefined,
  downPaymentType: values.downPaymentType,
  downPaymentFixed: Number(values.downPaymentFixed),
  downPaymentPercentage: Number(values.downPaymentPercentage),
  loanPeriodYears: Number(values.loanPeriodYears),
  interestRate: Number(values.interestRate),
})

export const toBudgetDTO = (values: BudgetFormDTO): BudgetFormDTO => ({
  name: values.name,
  monthly: Number(values.monthly),
  downPaymentType: values.downPaymentType,
  downPaymentFixed: Number(values.downPaymentFixed),
  downPaymentPercentage: Number(values.downPaymentPercentage),
  loanPeriodYears: Number(values.loanPeriodYears),
  interestRate: Number(values.interestRate),
})

// money formatting for copied text: thousands separators, at most two
// decimals, and floating point residue snapped to zero
export const fmtMoney = (value: number) =>
  (Math.abs(value) < 0.0005 ? 0 : value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })

// "10% (100,000)" for percentage down payments, "100,000" for fixed
export const downPaymentText = (
  dto: Pick<
    BudgetFormDTO,
    'downPaymentType' | 'downPaymentPercentage' | 'downPaymentFixed'
  >,
  computedFixed: number
) =>
  dto.downPaymentType === DownPaymentType.PERCENTAGE
    ? `${dto.downPaymentPercentage}% (${fmtMoney(computedFixed)})`
    : fmtMoney(dto.downPaymentFixed)

export const formToClipboardText = (
  dto: LoanFormDTO,
  preview: Details
): string => {
  const lines = [
    ...(dto.name ? [`Name: ${dto.name}`] : []),
    `Price: ${fmtMoney(dto.price)}`,
    ...(dto.sqft
      ? [
          `Sqft: ${fmtMoney(dto.sqft)} (${fmtMoney(
            preview.pricePerSqft ?? dto.price / dto.sqft
          )} / sqft)`,
        ]
      : []),
    `Down Payment: ${downPaymentText(dto, preview.downPaymentFixed)}`,
    `Loan Period: ${dto.loanPeriodYears} years`,
    `Interest Rate: ${dto.interestRate}%`,
    '---',
    `Monthly: ${fmtMoney(preview.monthly)}`,
    `Loan Size: ${fmtMoney(preview.loanSize)}`,
    '---',
    `Total Interest: ${fmtMoney(preview.totalInterest)}`,
    `Lifetime Cost: ${fmtMoney(preview.lifetimeCost)}`,
  ]
  return lines.join('\n')
}

export const budgetFormToClipboardText = (
  dto: BudgetFormDTO,
  preview: Details
): string => {
  const lines = [
    ...(dto.name ? [`Name: ${dto.name}`] : []),
    `Monthly: ${fmtMoney(dto.monthly)}`,
    `Down Payment: ${downPaymentText(dto, preview.downPaymentFixed)}`,
    `Loan Period: ${dto.loanPeriodYears} years`,
    `Interest Rate: ${dto.interestRate}%`,
    '---',
    `Price: ${fmtMoney(preview.price)}`,
    `Loan Size: ${fmtMoney(preview.loanSize)}`,
    '---',
    `Total Interest: ${fmtMoney(preview.totalInterest)}`,
    `Lifetime Cost: ${fmtMoney(preview.lifetimeCost)}`,
  ]
  return lines.join('\n')
}

export const useLoanForm = (initialValues: LoanFormDTO) =>
  useForm<LoanFormDTO>({
    resolver: zodResolver(loanFormSchema) as unknown as Resolver<LoanFormDTO>,
    defaultValues: toLoanDTO(initialValues),
  })

export const useBudgetForm = (initialValues: BudgetFormDTO) =>
  useForm<BudgetFormDTO>({
    resolver: zodResolver(
      budgetFormSchema
    ) as unknown as Resolver<BudgetFormDTO>,
    defaultValues: toBudgetDTO(initialValues),
  })
