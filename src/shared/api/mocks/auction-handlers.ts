import { formatISO, getTime } from 'date-fns'
import { HttpResponse, http } from 'msw'

import type { AuctionListRequest } from '@/shared/api/generated/schemas'
import {
  calculatePriceWithVat,
  isPriceValidForStep,
} from '@/shared/lib/money'
import { db, type Bet } from './db'
import { filterAuctions } from './filter-auctions'
import { findAuctionOr404, findMyBet } from './lib/auction-utils'
import { sortBetsByPrice } from './lib/sort-bets'

const CURRENT_USER = db.users.find((u: { role: string }) => u.role === 'carrier')

type ValidationError = { message: string; code: string }

// Валидация цены ставки: positive, min, max, step
function validateBetPrice(
  price: number,
  trading: { min?: number | null; max?: number | null; step?: number | null },
): ValidationError | null {
  if (!price || price <= 0) {
    return { message: 'Цена обязательна и должна быть больше 0', code: 'INVALID_PRICE' }
  }
  if (trading.min != null && price < trading.min) {
    return { message: `Цена должна быть не меньше ${trading.min}`, code: 'PRICE_TOO_LOW' }
  }
  if (trading.max != null && price > trading.max) {
    return { message: `Цена должна быть не больше ${trading.max}`, code: 'PRICE_TOO_HIGH' }
  }
  if (trading.step != null && !isPriceValidForStep(price, trading.step, trading.min)) {
    return { message: `Цена должна быть кратна шагу ${trading.step}`, code: 'INVALID_STEP' }
  }
  return null
}

// Пересчёт мест ставок по цене с учётом типа аукциона
function recalculatePlaces(auctionUuid: string) {
  const auction = db.auctions.find((a) => a.uuid === auctionUuid)
  if (!auction) return

  const sorted = sortBetsByPrice(
    db.bets.filter((b) => b.auctionUuid === auctionUuid && !b.isCancelled),
    auction.type,
  )

  sorted.forEach((bet, idx) => {
    bet.place = idx + 1
  })
}

// Обновление цен аукциона в зависимости от типа и лучших ставок
function updateAuctionPrices(auction: (typeof db.auctions)[number]) {
  const auctionBets = sortBetsByPrice(
    db.bets.filter((b) => b.auctionUuid === auction.uuid && !b.isCancelled),
    auction.type,
  )

  if (auctionBets.length === 0) return

  if (auction.type === 'Up' || auction.type === 'Request') {
    auction.currentPrice = auctionBets[0].price
    const secondBet = auctionBets[1]
    auction.availablePrice = secondBet
      ? secondBet.price + (auction.betStep ?? 0)
      : auctionBets[0].price + (auction.betStep ?? 0)
  } else if (auction.type === 'Down') {
    auction.currentPrice = auctionBets[auctionBets.length - 1].price
    const secondBet = auctionBets[auctionBets.length - 2]
    auction.availablePrice = secondBet
      ? secondBet.price - (auction.betStep ?? 0)
      : auctionBets[auctionBets.length - 1].price - (auction.betStep ?? 0)
  } else if (auction.type === 'FixPrice') {
    auction.currentPrice = auctionBets[0].price
    auction.availablePrice = auctionBets[0].price
  }
}

// Обновление торгового статуса пользователя и primaryAction
function updateUserTradingStatus(auction: typeof db.auctions[number]) {
  const myBet = db.bets.find(
    (b) => b.auctionUuid === auction.uuid && b.isMyBet && !b.isCancelled,
  )

  if (myBet) {
    auction.hasMyBet = true
    if (auction.status === 'active') {
      auction.userTradingStatus = myBet.place === 1 ? 'Leading' : 'Losing'
    } else if (auction.status === 'completed') {
      auction.userTradingStatus = myBet.isWinner ? 'Winner' : 'OutOfTrade'
    }
    auction.primaryAction =
      auction.status === 'active' ? 'edit_bet' : 'view_bets'
  } else {
    auction.hasMyBet = false
    auction.userTradingStatus = null
    auction.primaryAction = auction.trading.canSetBet ? 'make_bet' : null
  }
}

// Полное обновление состояния аукциона после изменения ставок
function updateAuctionState(auctionUuid: string) {
  const auction = db.auctions.find((a) => a.uuid === auctionUuid)
  if (!auction) return

  updateAuctionPrices(auction)
  updateUserTradingStatus(auction)
}

// Искусственная задержка ответа списка аукционов для демонстрации skeleton/loading states
const LIST_DELAY_MS = 1500

export const auctionHandlers = [
  http.post('/api/auctions/list', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, LIST_DELAY_MS))

    let body: AuctionListRequest = {}
    try {
      body = (await request.json()) as AuctionListRequest
    } catch {
      // empty body is fine
    }

    const result = filterAuctions(db.auctions, body)

    return HttpResponse.json(result)
  }),

  http.get('/api/auctions/:auctionUuid', ({ params }) => {
    const auctionUuid = params.auctionUuid as string
    const { auction, notFoundResponse } = findAuctionOr404(auctionUuid)
    if (notFoundResponse) return notFoundResponse

    return HttpResponse.json(auction)
  }),

  http.get('/api/auctions/:auctionUuid/bets', ({ params }) => {
    const auctionUuid = params.auctionUuid as string
    const { notFoundResponse } = findAuctionOr404(auctionUuid)
    if (notFoundResponse) return notFoundResponse

    const bets = db.bets
      .filter((b) => b.auctionUuid === auctionUuid)
      .sort((a, b) => a.place - b.place)

    return HttpResponse.json(bets)
  }),

  http.post('/api/auctions/:auctionUuid/bets', async ({ params, request }) => {
    const auctionUuid = params.auctionUuid as string
    const { auction, notFoundResponse } = findAuctionOr404(auctionUuid)
    if (notFoundResponse) return notFoundResponse

    if (!auction.trading.canSetBet) {
      return HttpResponse.json(
        { message: 'Торги недоступны для данного аукциона', code: 'TRADING_DISABLED' },
        { status: 422 },
      )
    }

    let body: { price: number }
    try {
      body = (await request.json()) as { price: number }
    } catch {
      return HttpResponse.json(
        { message: 'Некорректное тело запроса', code: 'INVALID_BODY' },
        { status: 422 },
      )
    }

    const validationError = validateBetPrice(body.price, auction.trading)
    if (validationError) {
      return HttpResponse.json(validationError, { status: 422 })
    }

    const existingMyBet = findMyBet(auctionUuid)

    if (existingMyBet) {
      existingMyBet.price = body.price
      existingMyBet.priceWithVat = calculatePriceWithVat(body.price, auction.paymentTerms.withoutVat)
      existingMyBet.createdAt = formatISO(new Date())
    } else {
      const newBet: Bet = {
        uuid: `bet-${getTime(new Date())}`,
        auctionUuid,
        carrier: CURRENT_USER?.companyName ?? 'ИП Иванов И.И.',
        price: body.price,
        priceWithVat: calculatePriceWithVat(body.price, auction.paymentTerms.withoutVat),
        place: 0,
        isWinner: false,
        isCancelled: false,
        cancelReason: null,
        createdAt: formatISO(new Date()),
        isMyBet: true,
      }
      db.bets.push(newBet)
    }

    recalculatePlaces(auctionUuid)
    updateAuctionState(auctionUuid)

    return HttpResponse.json(findMyBet(auctionUuid))
  }),

  http.get('/api/dictionaries', () => {
    return HttpResponse.json(db.dictionaries)
  }),

  http.get('/api/cities', () => {
    return HttpResponse.json(db.cities)
  }),

  http.get('/api/users/me', () => {
    if (!CURRENT_USER) {
      return HttpResponse.json(
        { message: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 },
      )
    }
    return HttpResponse.json(CURRENT_USER)
  }),
]
