import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { useFiltersStore } from './filters-store'

// Синхронизация URL ↔ store:
// — при загрузке/обновлении страницы URL инициализирует store (синхронно, через useState)
// — при изменении фильтров в store — URL обновляется (через useEffect)
export function useFiltersSync() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const initFromUrl = useFiltersStore((s) => s.initFromUrl)
  const filters = useFiltersStore((s) => s.filters)

  // URL → store: синхронная инициализация при первом рендере
  useState(() => initFromUrl(search))

  // store → URL: синхронизация при изменении фильтров
  useEffect(() => {
    void navigate({ search: filters, replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])
}
