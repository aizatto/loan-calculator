import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  getText: () => string
  label?: string
  // icon-only button (no text), e.g. for table action columns
  iconOnly?: boolean
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

  if (props.iconOnly) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Copy"
        onClick={handleCopy}
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    )
  }

  return (
    <Button type="button" variant="outline" onClick={handleCopy}>
      {copied ? <Check /> : <Copy />}
      {copied ? 'Copied' : (props.label ?? 'Copy')}
    </Button>
  )
}
