import type { AuctionType } from '@/shared/api/generated/schemas'

import type { Bet } from '../db'

// Сортировка ставок по цене с учётом типа аукциона:
// Up/FixPrice/Request — по убыванию (лучшая = максимальная цена)
// Down — по возрастанию (лучшая = минимальная цена)
// Request сортируется как Up, т.к. организатор выбирает перевозчика с максимальной ценой
export function sortBetsByPrice(bets: Bet[], auctionType: AuctionType): Bet[] {
  const descending = auctionType !== 'Down'
  return [...bets].sort((a, b) => {
    if (a.price === b.price) return 0
    if (descending) {
      return a.price < b.price ? 1 : -1
    }
    return a.price > b.price ? 1 : -1
  })
}
