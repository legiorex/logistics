import { Input } from '@/shared/ui/input'
import type { AuctionListSearch } from '../model/search-params'
import { FilterField } from './filter-field'

type DatePriceFiltersProps = {
  loadDateFrom: string | undefined
  loadDateTo: string | undefined
  priceFrom: number | undefined
  priceTo: number | undefined
  onChange: <K extends keyof AuctionListSearch>(key: K, value: AuctionListSearch[K]) => void
}

export function DatePriceFilters({
  loadDateFrom,
  loadDateTo,
  priceFrom,
  priceTo,
  onChange,
}: DatePriceFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
      <FilterField label="Погрузка от" htmlFor="filter-load-date-from">
        <Input
          id="filter-load-date-from"
          type="date"
          value={loadDateFrom ?? ''}
          onChange={(e) => onChange('loadDateFrom', e.target.value || undefined)}
        />
      </FilterField>
      <FilterField label="Погрузка до" htmlFor="filter-load-date-to">
        <Input
          id="filter-load-date-to"
          type="date"
          value={loadDateTo ?? ''}
          onChange={(e) => onChange('loadDateTo', e.target.value || undefined)}
        />
      </FilterField>
      <FilterField label="Цена от" htmlFor="filter-price-from">
        <Input
          id="filter-price-from"
          type="number"
          min={0}
          inputMode="numeric"
          value={priceFrom ?? ''}
          onChange={(e) => onChange('priceFrom', e.target.value === '' ? undefined : e.target.valueAsNumber)}
        />
      </FilterField>
      <FilterField label="Цена до" htmlFor="filter-price-to">
        <Input
          id="filter-price-to"
          type="number"
          min={0}
          inputMode="numeric"
          value={priceTo ?? ''}
          onChange={(e) => onChange('priceTo', e.target.value === '' ? undefined : e.target.valueAsNumber)}
        />
      </FilterField>
    </div>
  )
}
