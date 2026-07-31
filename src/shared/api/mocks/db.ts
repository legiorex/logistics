import type { AuctionStatus, AuctionType } from '@/shared/api/generated/schemas'
import auctionsData from './data/auctions.json'
import betsData from './data/bets.json'
import citiesData from './data/cities.json'
import dictionariesData from './data/dictionaries.json'
import usersData from './data/users.json'

export interface Auction {
  uuid: string
  requestNumber: string
  type: AuctionType
  status: AuctionStatus
  userTradingStatus: string | null
  hasMyBet: boolean
  primaryAction: string | null
  route: { load: string; unload: string }
  dates: {
    loadDateFrom: string
    loadDateTo: string
    unloadDateFrom: string
    unloadDateTo: string
  }
  cargo: { name: string; weightKg: number; volumeM3: number; bodyType: string }
  currentPrice: number | null
  availablePrice: number | null
  pricePerKm: number
  betStep: number | null
  organizer: {
    uuid: string
    name: string
    inn: string
    isContactsHidden: boolean
    contacts: { phone: string; email: string } | null
  }
  points: { type: string; city: string; address: string | null }[]
  paymentTerms: { type: string; delayDays: number; withoutVat: boolean }
  trading: {
    canSetBet: boolean
    hideBetsHistory: boolean
    hidePointsAddressAndContacts: boolean
    noViewCargoPrice: boolean
    min: number | null
    max: number | null
    step: number | null
  }
  isAvailable: boolean
  isBidder: boolean
}

export interface Bet {
  uuid: string
  auctionUuid: string
  carrier: string
  price: number
  priceWithVat: number
  place: number
  isWinner: boolean
  isCancelled: boolean
  cancelReason: string | null
  createdAt: string
  isMyBet: boolean
}

class MockDatabase {
  auctions: Auction[]
  bets: Bet[]
  cities: typeof citiesData
  dictionaries: typeof dictionariesData
  users: typeof usersData

  constructor() {
    this.auctions = structuredClone(auctionsData) as Auction[]
    this.bets = structuredClone(betsData) as Bet[]
    this.cities = structuredClone(citiesData)
    this.dictionaries = structuredClone(dictionariesData)
    this.users = structuredClone(usersData)
  }

  reset() {
    this.auctions = structuredClone(auctionsData) as Auction[]
    this.bets = structuredClone(betsData) as Bet[]
    this.cities = structuredClone(citiesData)
    this.dictionaries = structuredClone(dictionariesData)
    this.users = structuredClone(usersData)
  }
}

export const db = new MockDatabase()
