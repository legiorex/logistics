import type { Auction, Bet } from '@/shared/api/generated/schemas'
import auctionsData from './data/auctions.json'
import betsData from './data/bets.json'
import citiesData from './data/cities.json'
import dictionariesData from './data/dictionaries.json'
import usersData from './data/users.json'

export type { Auction, Bet }

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
