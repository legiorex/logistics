import { Badge } from '@/shared/ui/badge'
import type { Auction } from '@/shared/api/generated/schemas'
import {
  AuctionStatusBadge,
  AuctionTypeBadge,
  UserTradingStatusBadge,
} from './status-badges'

// Блок бейджей аукциона: тип, статус, торговый статус пользователя, флаг «Моя ставка»
export function AuctionBadges({ auction }: { auction: Auction }) {
  const { type, status, userTradingStatus, hasMyBet } = auction

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AuctionTypeBadge type={type} />
      <AuctionStatusBadge status={status} />
      {userTradingStatus && <UserTradingStatusBadge status={userTradingStatus} />}
      {hasMyBet && <Badge variant="secondary">Моя ставка есть</Badge>}
    </div>
  )
}
