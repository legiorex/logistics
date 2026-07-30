import { useGetAuctionBets } from '@/shared/api/generated/bets'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { BetRow } from '@/entities/bet'

interface BetsListWidgetProps {
  auctionUuid: string
  hideHistory: boolean
}

// Список ставок аукциона: таблица, число участников, empty/hidden states
export function BetsListWidget({ auctionUuid, hideHistory }: BetsListWidgetProps) {
  const { data, isPending, isError, refetch } = useGetAuctionBets(auctionUuid, {
    query: { enabled: !hideHistory },
  })

  if (hideHistory) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        История ставок скрыта организатором
      </p>
    )
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-muted-foreground">Не удалось загрузить ставки</p>
        <Button variant="outline" onClick={() => void refetch()}>
          Повторить
        </Button>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <p className="text-lg font-medium">Ставок пока нет</p>
        <p className="text-sm text-muted-foreground">
          Станьте первым участником торгов
        </p>
      </div>
    )
  }

  const participants = new Set(data.map((bet) => bet.carrier)).size

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Ставок: {data.length} · Участников: {participants}
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Место</TableHead>
            <TableHead>Перевозчик</TableHead>
            <TableHead className="text-right">Цена без НДС</TableHead>
            <TableHead className="text-right">Цена с НДС</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Причина отмены</TableHead>
            <TableHead className="text-right">Дата</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((bet) => (
            <BetRow key={bet.uuid} bet={bet} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
