import { HttpResponse } from 'msw'

import { db } from '../db'

// Поиск аукциона по UUID; если не найден — возвращает 404-ответ
export function findAuctionOr404(auctionUuid: string) {
  const auction = db.auctions.find((a) => a.uuid === auctionUuid)
  if (!auction) {
    return {
      auction: null,
      notFoundResponse: HttpResponse.json(
        { message: 'Аукцион не найден', code: 'NOT_FOUND' },
        { status: 404 },
      ),
    }
  }
  return { auction, notFoundResponse: null }
}

// Поиск ставки текущего пользователя по UUID аукциона
export function findMyBet(auctionUuid: string) {
  return db.bets.find(
    (b) => b.auctionUuid === auctionUuid && b.isMyBet && !b.isCancelled,
  )
}
