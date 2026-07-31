import { Link, useParams } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

import { useGetAuctionByUuid } from '@/shared/api/generated/auctions'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { BetsListWidget } from '@/widgets/bets-list'

export function AuctionBetsPage() {
  const { uuid } = useParams({ from: '/auctions/$uuid/bets' })
  const { data: auction, isPending, isError, refetch } = useGetAuctionByUuid(uuid)

  useDocumentTitle(
    auction ? `Ставки — Заявка № ${auction.requestNumber} — Грузовые аукционы` : 'Ставки — Грузовые аукционы',
  )

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">
          Аукцион не найден или произошла ошибка загрузки
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void refetch()}>
            Повторить
          </Button>
          <Button asChild variant="ghost">
            <Link to="/">К списку аукционов</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">
          Ставки по заявке № {auction.requestNumber}
        </h1>
        <Button asChild variant="link" className="w-fit px-0">
          <Link to="/auctions/$uuid" params={{ uuid }}>
            К аукциону
          </Link>
        </Button>
      </div>
      <BetsListWidget
        auctionUuid={uuid}
        hideHistory={auction.trading.hideBetsHistory}
      />
    </div>
  )
}
