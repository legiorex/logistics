import { Badge } from '@/shared/ui/badge'
import type {
  AuctionStatus,
  AuctionType,
  UserTradingStatus,
} from '@/shared/api/generated/schemas'
import { useDictionaries, getDictLabel } from '@/entities/dictionary'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

const statusVariants: Record<AuctionStatus, BadgeVariant> = {
  active: 'default',
  completed: 'secondary',
  cancelled: 'destructive',
  draft: 'outline',
}

const tradingStatusVariants: Record<UserTradingStatus, BadgeVariant> = {
  Leading: 'default',
  Winner: 'default',
  Losing: 'destructive',
  OutOfTrade: 'secondary',
  NotParticipant: 'outline',
}

export function AuctionStatusBadge({ status }: { status: AuctionStatus }) {
  const { data: dictionaries } = useDictionaries()
  return (
    <Badge variant={statusVariants[status]}>
      {getDictLabel(dictionaries?.auctionStatuses, status)}
    </Badge>
  )
}

export function AuctionTypeBadge({ type }: { type: AuctionType }) {
  const { data: dictionaries } = useDictionaries()
  return (
    <Badge variant="outline">
      {getDictLabel(dictionaries?.auctionTypes, type)}
    </Badge>
  )
}

export function UserTradingStatusBadge({
  status,
}: {
  status: UserTradingStatus
}) {
  const { data: dictionaries } = useDictionaries()
  return (
    <Badge variant={tradingStatusVariants[status]}>
      {getDictLabel(dictionaries?.userTradingStatuses, status)}
    </Badge>
  )
}
