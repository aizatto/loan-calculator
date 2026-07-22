import { FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  onLoad: () => void
}

// Loads a saved row's values back into the page form so they can be tweaked
// and saved as a new row.
export const LoadButton: React.FC<Props> = (props) => {
  return (
    <Button
      size="icon"
      variant="outline"
      aria-label="Load"
      onClick={() => {
        props.onLoad()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      <FolderOpen />
    </Button>
  )
}
