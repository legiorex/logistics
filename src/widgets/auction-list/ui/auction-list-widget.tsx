import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { getGetAuctionByUuidQueryOptions } from '@/shared/api/generated/auctions'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { AuctionCard, useAuctionsList } from '@/entities/auction'
import {
  AuctionFilters,
  toApiFilters,
  useFiltersSync,
  useFiltersStore,
} from '@/features/auction-filters'
import { AuctionListSkeleton } from './auction-list-skeleton'

const PAGE_SIZE = 6

// Список аукционов: фильтры, клиентская пагинация, prefetch детали по hover
export function AuctionListWidget() {
  useFiltersSync()

  const filters = useFiltersStore((s) => s.filters)
  const setFilter = useFiltersStore((s) => s.setFilter)
  const queryClient = useQueryClient()

  const { data, isPending, isError, refetch } = useAuctionsList(
    toApiFilters(filters),
  )

  const prefetchAuction = useCallback((uuid: string) => {
    void queryClient.prefetchQuery(getGetAuctionByUuidQueryOptions(uuid))
  }, [queryClient])

  const handleRetry = useCallback(() => void refetch(), [refetch])

  if (isPending) {
    return <AuctionListSkeleton />
  }

  if (isError) {
    return (
      <ErrorState
        message="Не удалось загрузить аукционы"
        onRetry={handleRetry}
      />
    )
  }

  const page = filters.page ?? 1
  const total = data.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = data.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const handlePrevPage = () => setFilter('page', currentPage - 1)
  const handleNextPage = () => setFilter('page', currentPage + 1)

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
                onPrefetch={prefetchAuction}
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
                onClick={handlePrevPage}
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
                onClick={handleNextPage}
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
