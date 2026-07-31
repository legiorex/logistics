import { Check, Copy } from 'lucide-react'

export function CopyButton({
  copied,
  onCopy,
  label,
}: {
  copied: boolean
  onCopy: () => void
  label: string
}) {
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
