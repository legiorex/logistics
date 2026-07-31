import { Link, useParams } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

import { useGetAuctionByUuid } from '@/shared/api/generated/auctions'
import type { Auction } from '@/shared/api/generated/schemas'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { ErrorState } from '@/shared/ui/error-state'
import { Skeleton } from '@/shared/ui/skeleton'
import { PlaceBetForm } from '@/features/place-bet'

function getPageTitle(auction: Auction | undefined): string {
  if (!auction) return 'Ставка — Грузовые аукционы'
  const action = auction.hasMyBet ? 'Изменить ставку' : 'Сделать ставку'
  return `${action} — Заявка № ${auction.requestNumber} — Грузовые аукционы`
}

export function PlaceBetPage() {
  const { uuid } = useParams({ from: '/auctions/$uuid/place-bet' })
  const { data: auction, isPending, isError, refetch } = useGetAuctionByUuid(uuid)

  useDocumentTitle(getPageTitle(auction))

  if (isPending) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-48 w-full" />
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
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <Button asChild variant="link" className="w-fit px-0">
        <Link to="/auctions/$uuid" params={{ uuid }}>
          К аукциону
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>
            {auction.hasMyBet ? 'Изменить ставку' : 'Сделать ставку'}
          </CardTitle>
          <CardDescription>
            Заявка № {auction.requestNumber} · {auction.route.load} —{' '}
            {auction.route.unload}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlaceBetForm auction={auction} />
        </CardContent>
      </Card>
    </div>
  )
}
