import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

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

function AuctionFiltersSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Поиск + Номер заявки */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>

      {/* Статус — бейджи */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-16" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>

      {/* Тип / Город погрузки / Город выгрузки */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>

      {/* Даты + цены */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>

      {/* Чекбоксы */}
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-sm" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-sm" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  )
}

function AuctionCardSkeleton() {
  return (
    <Card className="flex flex-col">
      {/* Header: бейджи + заголовок */}
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
        <Skeleton className="h-5 w-2/3" />
      </CardHeader>

      {/* Content: маршрут + таблица параметров */}
      <CardContent className="flex flex-1 flex-col gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-28" />
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="contents">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="ml-auto h-4 w-28" />
            </div>
          ))}
        </dl>
      </CardContent>

      {/* Footer: кнопка */}
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}

function AuctionPaginationSkeleton() {
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
