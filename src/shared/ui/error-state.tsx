import { Link } from '@tanstack/react-router'

import { Button } from '@/shared/ui/button'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
  backLink?: boolean
}

// Универсальный error-state: сообщение + кнопка «Повторить» + опциональная ссылка «К списку»
export function ErrorState({ message, onRetry, backLink }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
      <div className="flex gap-2">
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Повторить
          </Button>
        )}
        {backLink && (
          <Button asChild variant="ghost">
            <Link to="/">К списку аукционов</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
