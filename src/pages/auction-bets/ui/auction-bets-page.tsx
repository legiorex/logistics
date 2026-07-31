import { Link, useParams } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

import { useGetAuctionByUuid } from '@/shared/api/generated/auctions'
import { Button } from '@/shared/ui/button'
import { ErrorState } from '@/shared/ui/error-state'
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
      <ErrorState
        message="Аукцион не найден или произошла ошибка загрузки"
        onRetry={() => void refetch()}
        backLink
      />
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
