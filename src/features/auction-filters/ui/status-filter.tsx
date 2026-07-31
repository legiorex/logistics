import { memo } from 'react'

import type { AuctionStatus } from '@/shared/api/generated/schemas'
import { Badge } from '@/shared/ui/badge'
import { FilterField } from './filter-field'

type StatusFilterProps = {
  statuses: AuctionStatus[] | undefined
  options: { value: string; label: string }[] | undefined
  onToggle: (status: AuctionStatus) => void
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
          const active = statuses?.includes(item.value as AuctionStatus)
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
