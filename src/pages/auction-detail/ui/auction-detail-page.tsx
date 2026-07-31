import { Link, useParams } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

import { useGetAuctionByUuid } from '@/shared/api/generated/auctions'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { AuctionDetailsWidget } from '@/widgets/auction-details'

export function AuctionDetailPage() {
  const { uuid } = useParams({ from: '/auctions/$uuid/' })
  const { data, isPending, isError, refetch } = useGetAuctionByUuid(uuid)

  useDocumentTitle(
    data ? `Заявка № ${data.requestNumber} — Грузовые аукционы` : 'Аукцион — Грузовые аукционы',
  )

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
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

  return <AuctionDetailsWidget auction={data} />
}
