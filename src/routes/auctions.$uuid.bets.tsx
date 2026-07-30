import { createFileRoute } from '@tanstack/react-router'

import { AuctionBetsPage } from '@/pages/auction-bets'

export const Route = createFileRoute('/auctions/$uuid/bets')({
  component: AuctionBetsPage,
})
