import type { Auction, Bet } from '@/shared/api/generated/schemas'
import auctionsData from './data/auctions.json'
import betsData from './data/bets.json'
import citiesData from './data/cities.json'
import dictionariesData from './data/dictionaries.json'
import usersData from './data/users.json'

export type { Auction, Bet }

export const db = {
  auctions: structuredClone(auctionsData) as Auction[],
  bets: structuredClone(betsData) as Bet[],
  cities: structuredClone(citiesData),
  dictionaries: structuredClone(dictionariesData),
  users: structuredClone(usersData),
}
