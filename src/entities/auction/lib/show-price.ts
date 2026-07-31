import type { Auction } from '@/shared/api/generated/schemas'

// Видимость цены: скрыта, если установлен DTO-флаг noViewCargoPrice
export function isPriceVisible(auction: Pick<Auction, 'trading'>): boolean {
  return !auction.trading.noViewCargoPrice
}
