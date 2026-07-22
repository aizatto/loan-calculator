import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Details, LoanFormDTO } from '../components/types'
import { LoanForm } from '../components/LoanForm'
import { toLoanDTO, useLoanForm } from '../components/loanForms'

interface Props {
  record: Details
  onChange: (values: LoanFormDTO) => Details
  onUpdate: (values: LoanFormDTO) => void
  onDuplicate: (values: LoanFormDTO) => void
}

export const EditButton: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false)
  const form = useLoanForm(props.record)

  const handleUpdate = () => {
    setOpen(false)
    form.handleSubmit(props.onUpdate)()
  }

  const handleDuplicate = () => {
    props.onDuplicate(toLoanDTO(form.getValues()))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" aria-label="Edit">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>
        <LoanForm
          form={form}
          initialValues={props.record}
          onChange={props.onChange}
          onFinish={props.onUpdate}
          disableSubmit
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
          <Button onClick={handleDuplicate}>Save as Duplicate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
