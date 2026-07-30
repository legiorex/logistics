import { Badge } from '@/shared/ui/badge'
import { TableCell, TableRow } from '@/shared/ui/table'
import { formatDateTime, formatPrice } from '@/shared/lib/format'
import type { Bet } from '@/shared/api/generated/schemas'

export function BetRow({ bet }: { bet: Bet }) {
  return (
    <TableRow data-my-bet={bet.isMyBet || undefined} className={bet.isMyBet ? 'bg-accent/50' : undefined}>
      <TableCell className="font-medium">{bet.place}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{bet.carrier}</span>
          {bet.isMyBet && (
            <span className="text-xs text-muted-foreground">Моя ставка</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">{formatPrice(bet.price)}</TableCell>
      <TableCell className="text-right">{formatPrice(bet.priceWithVat)}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {bet.isWinner && <Badge>Победитель</Badge>}
          {bet.isCancelled && <Badge variant="destructive">Отменена</Badge>}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {bet.isCancelled ? (bet.cancelReason ?? '—') : ''}
      </TableCell>
      <TableCell className="text-right text-muted-foreground">
        {formatDateTime(bet.createdAt)}
      </TableCell>
    </TableRow>
  )
}
