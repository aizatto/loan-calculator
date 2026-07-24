import { CopyButton } from '@/components/CopyButton'
import { Details } from '@/components/types'
import { recordToClipboardText } from './recordText'

interface Props {
  record: Details
}

// icon copy button for the table action column; copies the same field text
// as the view dialog
export const CopyRowButton: React.FC<Props> = (props) => {
  return (
    <CopyButton iconOnly getText={() => recordToClipboardText(props.record)} />
  )
}
