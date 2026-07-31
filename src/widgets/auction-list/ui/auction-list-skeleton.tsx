import { AuctionFiltersSkeleton } from './auction-filters-skeleton'
import { AuctionCardSkeleton } from './auction-card-skeleton'
import { AuctionPaginationSkeleton } from './auction-pagination-skeleton'

const SKELETON_COUNT = 6

export function AuctionListSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <AuctionFiltersSkeleton />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <AuctionCardSkeleton key={index} />
        ))}
      </div>
      <AuctionPaginationSkeleton />
    </div>
  )
}
