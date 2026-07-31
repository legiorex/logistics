import type { AuctionType } from '@/shared/api/generated/schemas'
import { isEqualTo, isGreaterThan, isLessThan } from '@/shared/lib/money'

import type { Bet } from '../db'

// Сортировка ставок по цене с учётом типа аукциона:
// Up/FixPrice/Request — по убыванию (лучшая = максимальная цена)
// Down — по возрастанию (лучшая = минимальная цена)
export function sortBetsByPrice(bets: Bet[], auctionType: AuctionType): Bet[] {
  const descending = auctionType !== 'Down'
  return [...bets].sort((a, b) => {
    if (isEqualTo(a.price, b.price)) return 0
    return descending
      ? (isLessThan(a.price, b.price) ? 1 : -1)
      : (isGreaterThan(a.price, b.price) ? 1 : -1)
  })
}
