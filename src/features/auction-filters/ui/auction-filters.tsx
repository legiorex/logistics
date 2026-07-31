import { useNavigate, useSearch } from '@tanstack/react-router'

import { useGetCities } from '@/shared/api/generated/cities'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { useDictionaries } from '@/entities/dictionary'
import { useDebouncedFilter } from '../model/use-debounced-filter'
import { toApiFilters } from '../model/search-params'
import type { AuctionListSearch } from '../model/search-params'
import { FilterField } from './filter-field'
import { FilterSelect } from './filter-select'
import { StatusFilter } from './status-filter'
import { DatePriceFilters } from './date-price-filters'
import { CheckboxFilters } from './checkbox-filters'

const SEARCH_DEBOUNCE_MS = 400

// Фильтры списка аукционов; состояние синхронизировано с URL search params.
// search/type уходят на бэкенд (см. toApiFilters), остальные фильтры
// применяются клиентски (см. applyClientFilters) — AuctionListRequest их не поддерживает
export function AuctionFilters() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const { data: dictionaries } = useDictionaries()
  const { data: cities } = useGetCities({ query: { staleTime: Infinity } })

  const { value: searchValue, setValue: setSearchValue } = useDebouncedFilter(
    'search',
    search.search ?? '',
    SEARCH_DEBOUNCE_MS,
  )
  const { value: cargoNumValue, setValue: setCargoNumValue } = useDebouncedFilter(
    'cargoNum',
    search.cargoNum ?? '',
    SEARCH_DEBOUNCE_MS,
  )

  const updateFilter = <K extends keyof AuctionListSearch>(
    key: K,
    value: AuctionListSearch[K],
  ) => {
    void navigate({
      search: (prev: AuctionListSearch) => ({
        ...prev,
        [key]: value,
        page: 1,
      }),
    })
  }

  const resetFilters = () => {
    setSearchValue('')
    setCargoNumValue('')
    void navigate({ search: { page: 1 } })
  }

  const hasFilters = Object.values(toApiFilters(search)).some(
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
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </FilterField>
        <FilterField label="Номер заявки" htmlFor="filter-cargo-num">
          <Input
            id="filter-cargo-num"
            placeholder="Например, 10234"
            value={cargoNumValue}
            onChange={(event) => setCargoNumValue(event.target.value)}
          />
        </FilterField>
      </div>

      <StatusFilter
        statuses={search.statuses}
        options={dictionaries?.auctionStatuses}
        onToggle={(status) => {
          const current = search.statuses ?? []
          const next = current.includes(status)
            ? current.filter((item) => item !== status)
            : [...current, status]
          updateFilter('statuses', next.length > 0 ? next : undefined)
        }}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FilterSelect
          label="Тип аукциона"
          placeholder="Все типы"
          value={search.type}
          options={(dictionaries?.auctionTypes ?? []).map((item) => ({
            value: item.value,
            label: item.label,
          }))}
          onChange={(value) =>
            updateFilter('type', value as AuctionListSearch['type'])
          }
        />
        <FilterSelect
          label="Город погрузки"
          placeholder="Все города"
          value={search.loadCity}
          options={cityOptions}
          onChange={(value) => updateFilter('loadCity', value)}
        />
        <FilterSelect
          label="Город выгрузки"
          placeholder="Все города"
          value={search.unloadCity}
          options={cityOptions}
          onChange={(value) => updateFilter('unloadCity', value)}
        />
      </div>

      <DatePriceFilters
        loadDateFrom={search.loadDateFrom}
        loadDateTo={search.loadDateTo}
        priceFrom={search.priceFrom}
        priceTo={search.priceTo}
        onChange={updateFilter}
      />

      <CheckboxFilters
        isAvailable={search.isAvailable}
        isBidder={search.isBidder}
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
