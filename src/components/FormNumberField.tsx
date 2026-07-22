import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface Props<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  suffix?: string
}

export function FormNumberField<T extends FieldValues>({
  control,
  name,
  label,
  suffix,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              id={name}
              type="number"
              inputMode="decimal"
              step="any"
              className="max-w-52"
              aria-invalid={fieldState.invalid || undefined}
              {...field}
              value={field.value ?? ''}
            />
            {suffix ? (
              <span className="text-sm text-muted-foreground">{suffix}</span>
            ) : null}
          </div>
          <FieldError
            errors={fieldState.error ? [fieldState.error] : undefined}
          />
        </Field>
      )}
    />
  )
}
