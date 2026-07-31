import type { AuctionListRequest } from '@/shared/api/generated/schemas'

import type { Auction } from './db'

type Predicate = (auction: Auction, request: AuctionListRequest) => boolean

const matchesSearch: Predicate = (auction, req) => {
  if (!req.search) return true
  const q = req.search.toLowerCase()
  return (
    auction.requestNumber.toLowerCase().includes(q) ||
    auction.route.load.toLowerCase().includes(q) ||
    auction.route.unload.toLowerCase().includes(q) ||
    auction.cargo.name.toLowerCase().includes(q)
  )
}

const matchesCargoNum: Predicate = (auction, req) => {
  if (!req.cargoNum) return true
  return auction.requestNumber.toLowerCase().includes(req.cargoNum.toLowerCase())
}

const matchesStatuses: Predicate = (auction, req) =>
  !req.statuses?.length || req.statuses.includes(auction.status)

const matchesType: Predicate = (auction, req) =>
  !req.type || auction.type === req.type

const matchesLoadCity: Predicate = (auction, req) =>
  !req.loadCity || auction.route.load === req.loadCity

const matchesUnloadCity: Predicate = (auction, req) =>
  !req.unloadCity || auction.route.unload === req.unloadCity

const matchesLoadDateFrom: Predicate = (auction, req) =>
  !req.loadDateFrom || auction.dates.loadDateTo >= req.loadDateFrom

const matchesLoadDateTo: Predicate = (auction, req) =>
  !req.loadDateTo || auction.dates.loadDateFrom <= req.loadDateTo

const matchesIsAvailable: Predicate = (auction, req) =>
  req.isAvailable === undefined || auction.isAvailable === req.isAvailable

const matchesIsBidder: Predicate = (auction, req) =>
  req.isBidder === undefined || auction.isBidder === req.isBidder

const matchesPriceFrom: Predicate = (auction, req) =>
  req.priceFrom === undefined ||
  (auction.currentPrice != null && auction.currentPrice >= req.priceFrom)

const matchesPriceTo: Predicate = (auction, req) =>
  req.priceTo === undefined ||
  (auction.currentPrice != null && auction.currentPrice <= req.priceTo)

const predicates: Predicate[] = [
  matchesSearch,
  matchesCargoNum,
  matchesStatuses,
  matchesType,
  matchesLoadCity,
  matchesUnloadCity,
  matchesLoadDateFrom,
  matchesLoadDateTo,
  matchesIsAvailable,
  matchesIsBidder,
  matchesPriceFrom,
  matchesPriceTo,
]

export function filterAuctions(
  auctions: Auction[],
  request: AuctionListRequest,
): Auction[] {
  return auctions.filter((auction) =>
    predicates.every((pred) => pred(auction, request)),
  )
}
