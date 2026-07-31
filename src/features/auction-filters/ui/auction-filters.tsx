import { useNavigate, useSearch } from '@tanstack/react-router'

import { useGetCities } from '@/shared/api/generated/cities'
import type { AuctionStatus } from '@/shared/api/generated/schemas'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { useDictionaries } from '@/entities/dictionary'
import { useDebouncedFilter } from '../model/use-debounced-filter'
import { toApiFilters } from '../model/search-params'
import type { AuctionListSearch } from '../model/search-params'
import { FilterField } from './filter-field'
import { FilterSelect } from './filter-select'

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

  const toggleStatus = (status: AuctionStatus) => {
    const current = search.statuses ?? []
    const next = current.includes(status)
      ? current.filter((item) => item !== status)
      : [...current, status]
    updateFilter('statuses', next.length > 0 ? next : undefined)
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

      <FilterField label="Статус">
        <div className="flex flex-wrap gap-2">
          {dictionaries?.auctionStatuses.map((item) => {
            const active = search.statuses?.includes(item.value as AuctionStatus)
            return (
              <Badge
                key={item.value}
                asChild
                variant={active ? 'default' : 'outline'}
                className="cursor-pointer"
              >
                <button
                  type="button"
                  onClick={() => toggleStatus(item.value as AuctionStatus)}
                >
                  {item.label}
                </button>
              </Badge>
            )
          })}
        </div>
      </FilterField>

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <FilterField label="Погрузка от" htmlFor="filter-load-date-from">
          <Input
            id="filter-load-date-from"
            type="date"
            value={search.loadDateFrom ?? ''}
            onChange={(event) =>
              updateFilter('loadDateFrom', event.target.value || undefined)
            }
          />
        </FilterField>
        <FilterField label="Погрузка до" htmlFor="filter-load-date-to">
          <Input
            id="filter-load-date-to"
            type="date"
            value={search.loadDateTo ?? ''}
            onChange={(event) =>
              updateFilter('loadDateTo', event.target.value || undefined)
            }
          />
        </FilterField>
        <FilterField label="Цена от" htmlFor="filter-price-from">
          <Input
            id="filter-price-from"
            type="number"
            min={0}
            inputMode="numeric"
            value={search.priceFrom ?? ''}
            onChange={(event) =>
              updateFilter(
                'priceFrom',
                event.target.value === '' ? undefined : event.target.valueAsNumber,
              )
            }
          />
        </FilterField>
        <FilterField label="Цена до" htmlFor="filter-price-to">
          <Input
            id="filter-price-to"
            type="number"
            min={0}
            inputMode="numeric"
            value={search.priceTo ?? ''}
            onChange={(event) =>
              updateFilter(
                'priceTo',
                event.target.value === '' ? undefined : event.target.valueAsNumber,
              )
            }
          />
        </FilterField>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="filter-is-available"
            checked={search.isAvailable ?? false}
            onCheckedChange={(checked) =>
              updateFilter('isAvailable', checked === true ? true : undefined)
            }
          />
          <Label htmlFor="filter-is-available" className="cursor-pointer">
            Только доступные
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="filter-is-bidder"
            checked={search.isBidder ?? false}
            onCheckedChange={(checked) =>
              updateFilter('isBidder', checked === true ? true : undefined)
            }
          />
          <Label htmlFor="filter-is-bidder" className="cursor-pointer">
            Только с моими ставками
          </Label>
        </div>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={resetFilters} className="self-start">
          Сбросить фильтры
        </Button>
      )}
    </div>
  )
}
