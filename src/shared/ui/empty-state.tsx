interface EmptyStateProps {
  title: string
  subtitle?: string
}

// Универсальный empty-state: заголовок + опциональный подзаголовок
export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <p className="text-lg font-medium">{title}</p>
      {subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}
