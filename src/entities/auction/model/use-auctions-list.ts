import { useQuery } from '@tanstack/react-query'

import { getAuctionsList } from '@/shared/api/generated/auctions'
import type { AuctionListRequest } from '@/shared/api/generated/schemas'

// Список запрашивается POST'ом, поэтому Orval сгенерировал mutation;
// для кэширования и prefetch оборачиваем вызов в useQuery
export const auctionsListQueryKey = (filters: AuctionListRequest) =>
  ['auctions', 'list', filters] as const

// Базовый ключ для инвалидации всех list-запросов
export const auctionsListBaseKey = ['auctions', 'list'] as const

export function useAuctionsList(filters: AuctionListRequest) {
  return useQuery({
    queryKey: auctionsListQueryKey(filters),
    queryFn: ({ signal }) => getAuctionsList(filters, signal),
  })
}
