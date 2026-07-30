import { z } from 'zod'

import { AuctionStatus, AuctionType } from '@/shared/api/generated/schemas'

// Search params страницы списка; невалидные значения отбрасываются в fallback
export const auctionListSearchSchema = z.object({
  search: z.string().optional().catch(undefined),
  status: z.enum(Object.values(AuctionStatus)).optional().catch(undefined),
  type: z.enum(Object.values(AuctionType)).optional().catch(undefined),
  city: z.string().optional().catch(undefined),
  page: z.coerce.number().int().min(1).optional().catch(undefined),
})

export type AuctionListSearch = z.infer<typeof auctionListSearchSchema>

// Фильтры, уходящие в API (без page — пагинация клиентская)
export function toApiFilters(search: AuctionListSearch) {
  return {
    ...(search.search ? { search: search.search } : {}),
    ...(search.status ? { status: search.status } : {}),
    ...(search.type ? { type: search.type } : {}),
    ...(search.city ? { city: search.city } : {}),
  }
}
