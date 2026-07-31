import { http, HttpResponse } from 'msw'

import {
  addMoney,
  calculatePriceWithVat,
  isEqualTo,
  isGreaterThan,
  isLessThan,
  isPositiveMoney,
  modMoney,
  subtractMoney,
} from '@/shared/lib/money'
import { db, type Bet } from './db'

const CURRENT_USER = db.users.find((u: { role: string }) => u.role === 'carrier')

function recalculatePlaces(auctionUuid: string) {
  const auction = db.auctions.find((a) => a.uuid === auctionUuid)
  const descending = auction?.type !== 'Down'

  const auctionBets = db.bets
    .filter((b) => b.auctionUuid === auctionUuid && !b.isCancelled)
    .sort((a, b) => {
      if (isEqualTo(a.price, b.price)) return 0
      return descending ? (isLessThan(a.price, b.price) ? 1 : -1) : (isGreaterThan(a.price, b.price) ? 1 : -1)
    })

  auctionBets.forEach((bet, idx) => {
    bet.place = idx + 1
  })
}

function updateAuctionState(auctionUuid: string) {
  const auction = db.auctions.find((a) => a.uuid === auctionUuid)
  if (!auction) return

  const auctionBets = db.bets
    .filter((b) => b.auctionUuid === auctionUuid && !b.isCancelled)
    .sort((a, b) => {
      if (isEqualTo(a.price, b.price)) return 0
      return isLessThan(a.price, b.price) ? 1 : -1
    })

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
    let body: { search?: string; status?: string; type?: string; city?: string } = {}
    try {
      body = (await request.json()) as typeof body
    } catch {
      // empty body is fine
    }

    let result = [...db.auctions]

    if (body.search) {
      const q = body.search.toLowerCase()
      result = result.filter(
        (a) =>
          a.requestNumber.toLowerCase().includes(q) ||
          a.route.load.toLowerCase().includes(q) ||
          a.route.unload.toLowerCase().includes(q) ||
          a.cargo.name.toLowerCase().includes(q),
      )
    }

    if (body.status) {
      result = result.filter((a) => a.status === body.status)
    }

    if (body.type) {
      result = result.filter((a) => a.type === body.type)
    }

    if (body.city) {
      result = result.filter(
        (a) => a.route.load === body.city || a.route.unload === body.city,
      )
    }

    return HttpResponse.json(result)
  }),

  http.get('/api/auctions/:auctionUuid', ({ params }) => {
    const auctionUuid = params.auctionUuid as string
    const auction = db.auctions.find((a) => a.uuid === auctionUuid)

    if (!auction) {
      return HttpResponse.json(
        { message: 'Аукцион не найден', code: 'NOT_FOUND' },
        { status: 404 },
      )
    }

    return HttpResponse.json(auction)
  }),

  http.get('/api/auctions/:auctionUuid/bets', ({ params }) => {
    const auctionUuid = params.auctionUuid as string
    const auction = db.auctions.find((a) => a.uuid === auctionUuid)

    if (!auction) {
      return HttpResponse.json(
        { message: 'Аукцион не найден', code: 'NOT_FOUND' },
        { status: 404 },
      )
    }

    const bets = db.bets
      .filter((b) => b.auctionUuid === auctionUuid)
      .sort((a, b) => a.place - b.place)

    return HttpResponse.json(bets)
  }),

  http.post('/api/auctions/:auctionUuid/bets', async ({ params, request }) => {
    const auctionUuid = params.auctionUuid as string
    const auction = db.auctions.find((a) => a.uuid === auctionUuid)

    if (!auction) {
      return HttpResponse.json(
        { message: 'Аукцион не найден', code: 'NOT_FOUND' },
        { status: 404 },
      )
    }

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

    if (auction.trading.step !== null) {
      const remainder =
        auction.trading.min !== null
          ? modMoney(subtractMoney(body.price, auction.trading.min), auction.trading.step)
          : modMoney(body.price, auction.trading.step)
      if (!isEqualTo(remainder, 0)) {
        return HttpResponse.json(
          {
            message: `Цена должна быть кратна шагу ${auction.trading.step}`,
            code: 'INVALID_STEP',
          },
          { status: 422 },
        )
      }
    }

    const existingMyBet = db.bets.find(
      (b) => b.auctionUuid === auctionUuid && b.isMyBet && !b.isCancelled,
    )

    if (existingMyBet) {
      existingMyBet.price = body.price
      existingMyBet.priceWithVat = calculatePriceWithVat(body.price, auction.paymentTerms.withoutVat)
      existingMyBet.createdAt = new Date().toISOString()
    } else {
      const newBet: Bet = {
        uuid: `bet-${Date.now()}`,
        auctionUuid,
        carrier: CURRENT_USER?.companyName ?? 'ИП Иванов И.И.',
        price: body.price,
        priceWithVat: calculatePriceWithVat(body.price, auction.paymentTerms.withoutVat),
        place: 0,
        isWinner: false,
        isCancelled: false,
        cancelReason: null,
        createdAt: new Date().toISOString(),
        isMyBet: true,
      }
      db.bets.push(newBet)
    }

    recalculatePlaces(auctionUuid)
    updateAuctionState(auctionUuid)

    const myBet = db.bets.find(
      (b) => b.auctionUuid === auctionUuid && b.isMyBet && !b.isCancelled,
    )

    return HttpResponse.json(myBet)
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
