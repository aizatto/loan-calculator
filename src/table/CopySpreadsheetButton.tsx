import { Sheet } from 'lucide-react'
import { CopyButton } from '@/components/CopyButton'
import { Details } from '@/components/types'
import { recordToTSV } from './recordText'

interface Props {
  record: Details
}

// icon copy button for the table action column; copies the row as
// tab-separated field/value rows that paste cleanly into a spreadsheet
export const CopySpreadsheetButton: React.FC<Props> = (props) => {
  return (
    <CopyButton
      iconOnly
      label="Copy to spreadsheet"
      icon={<Sheet />}
      getText={() => recordToTSV(props.record)}
    />
  )
}
