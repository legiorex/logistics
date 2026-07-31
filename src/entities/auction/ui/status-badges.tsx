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

type AuctionStatusBadgeProps = {
  status: AuctionStatus
}

export function AuctionStatusBadge({ status }: AuctionStatusBadgeProps) {
  const { data: dictionaries } = useDictionaries()
  return (
    <Badge variant={statusVariants[status]}>
      {getDictLabel(dictionaries?.auctionStatuses, status)}
    </Badge>
  )
}

type AuctionTypeBadgeProps = {
  type: AuctionType
}

export function AuctionTypeBadge({ type }: AuctionTypeBadgeProps) {
  const { data: dictionaries } = useDictionaries()
  return (
    <Badge variant="outline">
      {getDictLabel(dictionaries?.auctionTypes, type)}
    </Badge>
  )
}

type UserTradingStatusBadgeProps = {
  status: UserTradingStatus
}

export function UserTradingStatusBadge({
  status,
}: UserTradingStatusBadgeProps) {
  const { data: dictionaries } = useDictionaries()
  return (
    <Badge variant={tradingStatusVariants[status]}>
      {getDictLabel(dictionaries?.userTradingStatuses, status)}
    </Badge>
  )
}
