import { formatISO, getTime } from 'date-fns'
import { http, HttpResponse } from 'msw'

import type { AuctionListRequest } from '@/shared/api/generated/schemas'
import {
  addMoney,
  calculatePriceWithVat,
  isGreaterThan,
  isLessThan,
  isPositiveMoney,
  isPriceValidForStep,
  subtractMoney,
} from '@/shared/lib/money'
import { db, type Bet } from './db'
import { filterAuctions } from './filter-auctions'
import { findAuctionOr404, findMyBet } from './lib/auction-utils'
import { sortBetsByPrice } from './lib/sort-bets'

const CURRENT_USER = db.users.find((u: { role: string }) => u.role === 'carrier')

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

function updateAuctionState(auctionUuid: string) {
  const auction = db.auctions.find((a) => a.uuid === auctionUuid)
  if (!auction) return

  const auctionBets = sortBetsByPrice(
    db.bets.filter((b) => b.auctionUuid === auctionUuid && !b.isCancelled),
    auction.type,
  )

  if (auctionBets.length === 0) return

  const myBet = auctionBets.find((b) => b.isMyBet)

  if (auction.type === 'Up') {
    auction.currentPrice = auctionBets[0].price
    const secondBet = auctionBets[1]
    auction.availablePrice = secondBet
      ? addMoney(secondBet.price, auction.betStep ?? 0)
      : addMoney(auctionBets[0].price, auction.betStep ?? 0)
  } else if (auction.type === 'Down') {
    auction.currentPrice = auctionBets[auctionBets.length - 1].price
    const secondBet = auctionBets[auctionBets.length - 2]
    auction.availablePrice = secondBet
      ? subtractMoney(secondBet.price, auction.betStep ?? 0)
      : subtractMoney(auctionBets[auctionBets.length - 1].price, auction.betStep ?? 0)
  } else if (auction.type === 'FixPrice') {
    auction.currentPrice = auctionBets[0].price
    auction.availablePrice = auctionBets[0].price
  }

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

export const auctionHandlers = [
  http.post('/api/auctions/list', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

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

    if (!body.price || !isPositiveMoney(body.price)) {
      return HttpResponse.json(
        { message: 'Цена обязательна и должна быть больше 0', code: 'INVALID_PRICE' },
        { status: 422 },
      )
    }

    if (auction.trading.min !== null && isLessThan(body.price, auction.trading.min)) {
      return HttpResponse.json(
        {
          message: `Цена должна быть не меньше ${auction.trading.min}`,
          code: 'PRICE_TOO_LOW',
        },
        { status: 422 },
      )
    }

    if (auction.trading.max !== null && isGreaterThan(body.price, auction.trading.max)) {
      return HttpResponse.json(
        {
          message: `Цена должна быть не больше ${auction.trading.max}`,
          code: 'PRICE_TOO_HIGH',
        },
        { status: 422 },
      )
    }

    if (!isPriceValidForStep(body.price, auction.trading.step, auction.trading.min)) {
      return HttpResponse.json(
        {
          message: `Цена должна быть кратна шагу ${auction.trading.step}`,
          code: 'INVALID_STEP',
        },
        { status: 422 },
      )
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
