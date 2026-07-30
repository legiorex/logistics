import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { useGetCities } from '@/shared/api/generated/cities'
import { Button } from '@/shared/ui/button'
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

// Фильтры списка аукционов; состояние синхронизировано с URL search params
export function AuctionFilters() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const { data: dictionaries } = useDictionaries()
  const { data: cities } = useGetCities({ query: { staleTime: Infinity } })

  const [searchValue, setSearchValue] = useState(search.search ?? '')

  // Дебаунс текстового поиска, чтобы не дёргать API на каждый символ
  useEffect(() => {
    if (searchValue === (search.search ?? '')) return
    const timer = setTimeout(() => {
      void navigate({
        search: (prev: AuctionListSearch) => ({
          ...prev,
          search: searchValue || undefined,
          page: 1,
        }),
        replace: true,
      })
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchValue, search.search, navigate])

  const updateFilter = (
    key: 'status' | 'type' | 'city',
    value: string,
  ) => {
    void navigate({
      search: (prev: AuctionListSearch) => ({
        ...prev,
        [key]: value === ALL ? undefined : value,
        page: 1,
      }),
    })
  }

  const resetFilters = () => {
    setSearchValue('')
    void navigate({ search: { page: 1 } })
  }

  const hasFilters =
    Boolean(search.search) ||
    Boolean(search.status) ||
    Boolean(search.type) ||
    Boolean(search.city)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="filter-search">Поиск</Label>
        <Input
          id="filter-search"
          placeholder="Номер заявки, город, груз"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label>Статус</Label>
          <Select
            value={search.status ?? ALL}
            onValueChange={(value) => updateFilter('status', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все статусы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Все статусы</SelectItem>
              {dictionaries?.auctionStatuses.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Тип аукциона</Label>
          <Select
            value={search.type ?? ALL}
            onValueChange={(value) => updateFilter('type', value)}
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
          <Label>Город</Label>
          <Select
            value={search.city ?? ALL}
            onValueChange={(value) => updateFilter('city', value)}
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

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={resetFilters} className="self-start">
          Сбросить фильтры
        </Button>
      )}
    </div>
  )
}
