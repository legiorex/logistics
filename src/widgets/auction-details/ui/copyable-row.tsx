import { CopyButton } from './copy-button'

type CopyableRowProps = {
  label: string
  value: string
  copied: boolean
  onCopy: () => void
}

export function CopyableRow({
  label,
  value,
  copied,
  onCopy,
}: CopyableRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-1.5 text-right font-medium">
        {value}
        {value !== '—' && (
          <CopyButton copied={copied} onCopy={onCopy} label={label} />
        )}
      </dd>
    </div>
  )
}
