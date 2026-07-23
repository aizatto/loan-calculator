import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  getText: () => string
  label?: string
}

export const CopyButton: React.FC<Props> = (props) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.getText())
    } catch {
      // clipboard access denied (e.g. document not focused); no feedback
      return
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button type="button" variant="outline" onClick={handleCopy}>
      {copied ? <Check /> : <Copy />}
      {copied ? 'Copied' : (props.label ?? 'Copy')}
    </Button>
  )
}
