import { Link, useParams } from '@tanstack/react-router'

import { useGetAuctionByUuid } from '@/shared/api/generated/auctions'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { PlaceBetForm } from '@/features/place-bet'

export function PlaceBetPage() {
  const { uuid } = useParams({ from: '/auctions/$uuid/place-bet' })
  const { data: auction, isPending, isError, refetch } = useGetAuctionByUuid(uuid)

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
