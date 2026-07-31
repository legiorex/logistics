import { memo } from 'react'

import { AuctionStatus } from '@/shared/api/generated/schemas'
import { Badge } from '@/shared/ui/badge'
import { FilterField } from './filter-field'

type StatusFilterProps = {
  statuses: AuctionStatus[] | undefined
  options: { value: string; label: string }[] | undefined
  onToggle: (status: AuctionStatus) => void
}

// Проверка, что значение из справочника — валидный AuctionStatus
function isAuctionStatus(value: string): value is AuctionStatus {
  return Object.values(AuctionStatus).includes(value as AuctionStatus)
}

export const StatusFilter = memo(function StatusFilter({
  statuses,
  options,
  onToggle,
}: StatusFilterProps) {

  return (
    <FilterField label="Статус">
      <div className="flex flex-wrap gap-2">
        {options?.map((item) => {
          if (!isAuctionStatus(item.value)) return null
          const active = statuses?.includes(item.value)
          return (
            <Badge
              key={item.value}
              asChild
              variant={active ? 'default' : 'outline'}
              className="cursor-pointer"
            >
              <button
                type="button"
                onClick={() => onToggle(item.value as AuctionStatus)}
              >
                {item.label}
              </button>
            </Badge>
          )
        })}
      </div>
    </FilterField>
  )
})
