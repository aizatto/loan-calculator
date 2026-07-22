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
import { BudgetFormDTO, Details } from '../components/types'
import { BudgetForm } from '../components/BudgetForm'
import { toBudgetDTO, useBudgetForm } from '../components/loanForms'

interface Props {
  record: Details
  onChange: (values: BudgetFormDTO) => Details
  onUpdate: (values: BudgetFormDTO) => void
  onDuplicate: (values: BudgetFormDTO) => void
}

export const EditBudgetButton: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false)
  const form = useBudgetForm(props.record)

  const handleUpdate = () => {
    setOpen(false)
    form.handleSubmit(props.onUpdate)()
  }

  const handleDuplicate = () => {
    props.onDuplicate(toBudgetDTO(form.getValues()))
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
        <BudgetForm
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
