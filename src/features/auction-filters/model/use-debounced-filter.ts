import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useDebounceValue } from 'usehooks-ts'

import type { AuctionListSearch } from './search-params'

// Дебаунс текстового поля фильтра: локальный state → debounce → URL search params
export function useDebouncedFilter(
  key: keyof AuctionListSearch,
  initialValue: string,
  debounceMs: number,
) {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const [value, setValue] = useState(initialValue)
  const [debouncedValue] = useDebounceValue(value, debounceMs)

  const currentValue = search[key] as string | undefined

  useEffect(() => {
    if (debouncedValue === (currentValue ?? '')) return
    void navigate({
      search: (prev: AuctionListSearch) => ({
        ...prev,
        [key]: debouncedValue || undefined,
        page: 1,
      }),
      replace: true,
    })
  }, [debouncedValue, currentValue, key, navigate])

  return { value, setValue }
}
