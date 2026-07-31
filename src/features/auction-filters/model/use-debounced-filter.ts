import { useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'

import { useFiltersStore } from './filters-store'

// Дебаунс текстового поля фильтра: локальный state → debounce → store
export function useDebouncedFilter(
  key: 'search' | 'cargoNum',
  initialValue: string,
  debounceMs: number,
) {
  const setFilter = useFiltersStore((s) => s.setFilter)
  const storeValue = useFiltersStore((s) => s.filters[key])
  const [value, setValue] = useState(initialValue)
  const [debouncedValue] = useDebounceValue(value, debounceMs)

  useEffect(() => {
    if (debouncedValue === (storeValue ?? '')) return
    setFilter(key, debouncedValue || undefined)
  }, [debouncedValue, storeValue, key, setFilter])

  return { value, setValue }
}
