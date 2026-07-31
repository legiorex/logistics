import { z } from 'zod'

import type { AuctionListRequest } from '@/shared/api/generated/schemas'
import { AuctionStatus, AuctionType } from '@/shared/api/generated/schemas'

// Search params страницы списка; невалидные значения отбрасываются в fallback.
// Поля соответствуют AuctionListRequest — все фильтры уходят на бэкенд
export const auctionListSearchSchema = z.object({
  search: z.string().optional().catch(undefined),
  type: z.enum(Object.values(AuctionType)).optional().catch(undefined),
  cargoNum: z.string().optional().catch(undefined),
  statuses: z.array(z.enum(Object.values(AuctionStatus))).optional().catch(undefined),
  loadCity: z.string().optional().catch(undefined),
  unloadCity: z.string().optional().catch(undefined),
  loadDateFrom: z.iso.date().optional().catch(undefined),
  loadDateTo: z.iso.date().optional().catch(undefined),
  isAvailable: z.boolean().optional().catch(undefined),
  isBidder: z.boolean().optional().catch(undefined),
  priceFrom: z.coerce.number().min(0).optional().catch(undefined),
  priceTo: z.coerce.number().min(0).optional().catch(undefined),
  page: z.coerce.number().int().min(1).optional().catch(undefined),
})

export type AuctionListSearch = z.infer<typeof auctionListSearchSchema>

// Фильтры, уходящие в API (без page — пагинация клиентская)
export function toApiFilters(search: AuctionListSearch): AuctionListRequest {
  const { page: _page, ...rest } = search
  void _page
  const filters: AuctionListRequest = {}

  for (const [key, value] of Object.entries(rest)) {
    if (value === '' || value === undefined) continue
    if (typeof value === 'number' && Number.isNaN(value)) continue
    Object.assign(filters, { [key]: value })
  }

  return filters
}
