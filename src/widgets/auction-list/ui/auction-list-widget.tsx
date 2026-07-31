import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { getGetAuctionByUuidQueryOptions } from '@/shared/api/generated/auctions'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { AuctionCard, useAuctionsList } from '@/entities/auction'
import { AuctionFilters, toApiFilters } from '@/features/auction-filters'
import { AuctionListSkeleton } from './auction-list-skeleton'

const PAGE_SIZE = 6

// Список аукционов: фильтры, клиентская пагинация, prefetch детали по hover
export function AuctionListWidget() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const queryClient = useQueryClient()

  const { data, isPending, isError, refetch } = useAuctionsList(
    toApiFilters(search),
  )

  const prefetchAuction = (uuid: string) => {
    void queryClient.prefetchQuery(getGetAuctionByUuidQueryOptions(uuid))
  }

  if (isPending) {
    return <AuctionListSkeleton />
  }

  if (isError) {
    return (
      <ErrorState
        message="Не удалось загрузить аукционы"
        onRetry={() => void refetch()}
      />
    )
  }

  const page = search.page ?? 1
  const total = data.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = data.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const setPage = (nextPage: number) => {
    void navigate({
      search: (prev) => ({ ...prev, page: nextPage }),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <AuctionFilters />

      {total === 0 ? (
        <EmptyState
          title="Аукционы не найдены"
          subtitle="Попробуйте изменить фильтры или поисковый запрос"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((auction) => (
              <AuctionCard
                key={auction.uuid}
                auction={auction}
                onPrefetch={() => prefetchAuction(auction.uuid)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Найдено: {total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Назад
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentPage} / {pageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                Вперёд
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
