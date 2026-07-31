import { Checkbox } from '@/shared/ui/checkbox'
import { Label } from '@/shared/ui/label'
import type { AuctionListSearch } from '../model/search-params'

export function CheckboxFilters({
  isAvailable,
  isBidder,
  onChange,
}: {
  isAvailable: boolean | undefined
  isBidder: boolean | undefined
  onChange: <K extends keyof AuctionListSearch>(key: K, value: AuctionListSearch[K]) => void
}) {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex items-center gap-2">
        <Checkbox
          id="filter-is-available"
          checked={isAvailable ?? false}
          onCheckedChange={(checked) =>
            onChange('isAvailable', checked === true ? true : undefined)
          }
        />
        <Label htmlFor="filter-is-available" className="cursor-pointer">
          Только доступные
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="filter-is-bidder"
          checked={isBidder ?? false}
          onCheckedChange={(checked) =>
            onChange('isBidder', checked === true ? true : undefined)
          }
        />
        <Label htmlFor="filter-is-bidder" className="cursor-pointer">
          Только с моими ставками
        </Label>
      </div>
    </div>
  )
}
