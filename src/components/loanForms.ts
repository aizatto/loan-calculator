import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { BudgetFormDTO, DownPaymentType, LoanFormDTO } from './types'

// HTML number inputs yield strings (and '' when cleared); antd's InputNumber
// yielded numbers. Coerce on validation so the DTOs keep their exact shape,
// and treat an empty input as missing so the required message fires.
const requiredNumber = (message: string) =>
  z.preprocess(
    (value) => (value === '' || value === null ? undefined : value),
    z.coerce.number({ error: message })
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
