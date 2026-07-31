import { useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { useFiltersStore } from './filters-store'

// Синхронизация URL ↔ store:
// — при загрузке/обновлении страницы URL инициализирует store (один раз)
// — после инициализации при изменении фильтров в store — URL обновляется
export function useFiltersSync() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const initFromUrl = useFiltersStore((s) => s.initFromUrl)
  const filters = useFiltersStore((s) => s.filters)
  const isInitialized = useFiltersStore((s) => s.isInitialized)

  // URL → store: инициализация при первом рендере
  useEffect(() => {
    if (isInitialized) return
    initFromUrl(search)
  }, [isInitialized, initFromUrl, search])

  // store → URL: синхронизация при изменении фильтров (только после инициализации)
  useEffect(() => {
    if (!isInitialized) return
    void navigate({ search: filters, replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, isInitialized])
}
