import { useParams } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

import { useGetAuctionByUuid } from '@/shared/api/generated/auctions'
import { ErrorState } from '@/shared/ui/error-state'
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
      <ErrorState
        message="Аукцион не найден или произошла ошибка загрузки"
        onRetry={() => void refetch()}
        backLink
      />
    )
  }

  return <AuctionDetailsWidget auction={data} />
}
