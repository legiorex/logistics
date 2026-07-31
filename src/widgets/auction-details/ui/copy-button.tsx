import { Check, Copy } from 'lucide-react'

type CopyButtonProps = {
  copied: boolean
  onCopy: () => void
  label: string
}

export function CopyButton({
  copied,
  onCopy,
  label,
}: CopyButtonProps) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className="text-muted-foreground transition-colors hover:text-foreground"
      aria-label={`Скопировать ${label}`}
    >
      {copied && <Check className="size-3.5 text-green-600" />}
      {!copied && <Copy className="size-3.5" />}
    </button>
  )
}
