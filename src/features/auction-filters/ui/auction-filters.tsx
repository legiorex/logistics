import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useDebounceValue } from 'usehooks-ts'

import { useGetCities } from '@/shared/api/generated/cities'
import type { AuctionStatus } from '@/shared/api/generated/schemas'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { useDictionaries } from '@/entities/dictionary'
import type { AuctionListSearch } from '../model/search-params'

const ALL = 'all'
const SEARCH_DEBOUNCE_MS = 400

// Фильтры списка аукционов; состояние синхронизировано с URL search params.
// search/type уходят на бэкенд (см. toApiFilters), остальные фильтры
// применяются клиентски (см. applyClientFilters) — AuctionListRequest их не поддерживает
export function AuctionFilters() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const { data: dictionaries } = useDictionaries()
  const { data: cities } = useGetCities({ query: { staleTime: Infinity } })

  const [searchValue, setSearchValue] = useState(search.search ?? '')
  const [debouncedSearchValue] = useDebounceValue(searchValue, SEARCH_DEBOUNCE_MS)

  const [cargoNumValue, setCargoNumValue] = useState(search.cargoNum ?? '')
  const [debouncedCargoNumValue] = useDebounceValue(cargoNumValue, SEARCH_DEBOUNCE_MS)

  // Дебаунс текстового поиска, чтобы не дёргать API на каждый символ
  useEffect(() => {
    if (debouncedSearchValue === (search.search ?? '')) return
    void navigate({
      search: (prev: AuctionListSearch) => ({
        ...prev,
        search: debouncedSearchValue || undefined,
        page: 1,
      }),
      replace: true,
    })
  }, [debouncedSearchValue, search.search, navigate])

  useEffect(() => {
    if (debouncedCargoNumValue === (search.cargoNum ?? '')) return
    void navigate({
      search: (prev: AuctionListSearch) => ({
        ...prev,
        cargoNum: debouncedCargoNumValue || undefined,
        page: 1,
      }),
      replace: true,
    })
  }, [debouncedCargoNumValue, search.cargoNum, navigate])

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

  const hasFilters =
    Boolean(search.search) ||
    Boolean(search.cargoNum) ||
    Boolean(search.statuses?.length) ||
    Boolean(search.type) ||
    Boolean(search.loadCity) ||
    Boolean(search.unloadCity) ||
    Boolean(search.loadDateFrom) ||
    Boolean(search.loadDateTo) ||
    search.isAvailable !== undefined ||
    search.isBidder !== undefined ||
    search.priceFrom !== undefined ||
    search.priceTo !== undefined

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-search">Поиск</Label>
          <Input
            id="filter-search"
            placeholder="Номер заявки, город, груз"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-cargo-num">Номер заявки</Label>
          <Input
            id="filter-cargo-num"
            placeholder="Например, 10234"
            value={cargoNumValue}
            onChange={(event) => setCargoNumValue(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Статус</Label>
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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label>Тип аукциона</Label>
          <Select
            value={search.type ?? ALL}
            onValueChange={(value) =>
              updateFilter('type', value === ALL ? undefined : (value as AuctionListSearch['type']))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все типы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Все типы</SelectItem>
              {dictionaries?.auctionTypes.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Город погрузки</Label>
          <Select
            value={search.loadCity ?? ALL}
            onValueChange={(value) =>
              updateFilter('loadCity', value === ALL ? undefined : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все города" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Все города</SelectItem>
              {cities?.map((city) => (
                <SelectItem key={city.code} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Город выгрузки</Label>
          <Select
            value={search.unloadCity ?? ALL}
            onValueChange={(value) =>
              updateFilter('unloadCity', value === ALL ? undefined : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все города" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Все города</SelectItem>
              {cities?.map((city) => (
                <SelectItem key={city.code} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-load-date-from">Погрузка от</Label>
          <Input
            id="filter-load-date-from"
            type="date"
            value={search.loadDateFrom ?? ''}
            onChange={(event) =>
              updateFilter('loadDateFrom', event.target.value || undefined)
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-load-date-to">Погрузка до</Label>
          <Input
            id="filter-load-date-to"
            type="date"
            value={search.loadDateTo ?? ''}
            onChange={(event) =>
              updateFilter('loadDateTo', event.target.value || undefined)
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-price-from">Цена от</Label>
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
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-price-to">Цена до</Label>
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
        </div>
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
