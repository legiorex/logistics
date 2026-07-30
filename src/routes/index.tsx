import { createFileRoute } from '@tanstack/react-router'

import { auctionListSearchSchema } from '@/features/auction-filters'
import { AuctionListPage } from '@/pages/auction-list'

export const Route = createFileRoute('/')({
  validateSearch: auctionListSearchSchema,
  component: AuctionListPage,
})
