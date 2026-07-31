import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

export function AuctionCardSkeleton() {
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
            <div key={`row-${i}`} className="contents">
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
