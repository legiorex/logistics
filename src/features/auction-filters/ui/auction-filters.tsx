import { type ChangeEvent } from 'react'

import { useGetCities } from '@/shared/api/generated/cities'
import type { AuctionStatus } from '@/shared/api/generated/schemas'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { useDictionaries } from '@/entities/dictionary'
import { useFiltersStore } from '../model/filters-store'
import { useDebouncedFilter } from '../model/use-debounced-filter'
import { toApiFilters } from '../model/search-params'
import type { AuctionListSearch } from '../model/search-params'
import { FilterField } from './filter-field'
import { FilterSelect } from './filter-select'
import { StatusFilter } from './status-filter'
import { DatePriceFilters } from './date-price-filters'
import { CheckboxFilters } from './checkbox-filters'

const SEARCH_DEBOUNCE_MS = 400

// Фильтры списка аукционов; состояние в store (см. filters-store).
// URL инициализирует store при загрузке, далее store → URL синхронизируется (см. useFiltersSync).
export function AuctionFilters() {
  const filters = useFiltersStore((s) => s.filters)
  const setFilter = useFiltersStore((s) => s.setFilter)
  const resetFiltersStore = useFiltersStore((s) => s.resetFilters)
  const { data: dictionaries } = useDictionaries()
  const { data: cities } = useGetCities({ query: { staleTime: Infinity } })

  const { value: searchValue, setValue: setSearchValue } = useDebouncedFilter(
    'search',
    filters.search ?? '',
    SEARCH_DEBOUNCE_MS,
  )
  const { value: cargoNumValue, setValue: setCargoNumValue } = useDebouncedFilter(
    'cargoNum',
    filters.cargoNum ?? '',
    SEARCH_DEBOUNCE_MS,
  )

  const updateFilter = <K extends keyof AuctionListSearch>(
    key: K,
    value: AuctionListSearch[K],
  ) => {
    setFilter(key, value)
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(event.target.value)

  const handleCargoNumChange = (event: ChangeEvent<HTMLInputElement>) =>
    setCargoNumValue(event.target.value)

  const handleStatusToggle = (status: AuctionStatus) => {
    const current = filters.statuses ?? []
    const next = current.includes(status)
      ? current.filter((item) => item !== status)
      : [...current, status]
    updateFilter('statuses', next.length > 0 ? next : undefined)
  }

  const handleTypeChange = (value: string | undefined) =>
    updateFilter('type', value as AuctionListSearch['type'])

  const handleLoadCityChange = (value: string | undefined) =>
    updateFilter('loadCity', value)

  const handleUnloadCityChange = (value: string | undefined) =>
    updateFilter('unloadCity', value)

  const resetFilters = () => {
    setSearchValue('')
    setCargoNumValue('')
    resetFiltersStore()
  }

  const hasFilters = Object.values(toApiFilters(filters)).some(
    (v) => v !== undefined && v !== '',
  )

  const cityOptions = (cities ?? []).map((city) => ({
    value: city.name,
    label: city.name,
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FilterField label="Поиск" htmlFor="filter-search">
          <Input
            id="filter-search"
            placeholder="Номер заявки, город, груз"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </FilterField>
        <FilterField label="Номер заявки" htmlFor="filter-cargo-num">
          <Input
            id="filter-cargo-num"
            placeholder="Например, 10234"
            value={cargoNumValue}
            onChange={handleCargoNumChange}
          />
        </FilterField>
      </div>

      <StatusFilter
        statuses={filters.statuses}
        options={dictionaries?.auctionStatuses}
        onToggle={handleStatusToggle}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FilterSelect
          label="Тип аукциона"
          placeholder="Все типы"
          value={filters.type}
          options={(dictionaries?.auctionTypes ?? []).map((item) => ({
            value: item.value,
            label: item.label,
          }))}
          onChange={handleTypeChange}
        />
        <FilterSelect
          label="Город погрузки"
          placeholder="Все города"
          value={filters.loadCity}
          options={cityOptions}
          onChange={handleLoadCityChange}
        />
        <FilterSelect
          label="Город выгрузки"
          placeholder="Все города"
          value={filters.unloadCity}
          options={cityOptions}
          onChange={handleUnloadCityChange}
        />
      </div>

      <DatePriceFilters
        loadDateFrom={filters.loadDateFrom}
        loadDateTo={filters.loadDateTo}
        priceFrom={filters.priceFrom}
        priceTo={filters.priceTo}
        onChange={updateFilter}
      />

      <CheckboxFilters
        isAvailable={filters.isAvailable}
        isBidder={filters.isBidder}
        onChange={updateFilter}
      />

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={resetFilters} className="self-start">
          Сбросить фильтры
        </Button>
      )}
    </div>
  )
}
