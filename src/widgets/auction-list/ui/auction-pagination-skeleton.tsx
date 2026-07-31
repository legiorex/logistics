import { Skeleton } from '@/shared/ui/skeleton'

export function AuctionPaginationSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-24" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}
