import { create } from 'zustand'

import type { AuctionListSearch } from './search-params'

interface FiltersState {
  filters: AuctionListSearch
  initFromUrl: (search: AuctionListSearch) => void
  setFilter: <K extends keyof AuctionListSearch>(key: K, value: AuctionListSearch[K]) => void
  resetFilters: () => void
}

// Store фильтров — единственный источник правды для состояния фильтров.
// URL params инициализируют store при загрузке страницы (см. useFiltersSync).
export const useFiltersStore = create<FiltersState>()((set) => ({
  filters: {},
  initFromUrl: (search) => set({ filters: search }),
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
        ...(key !== 'page' ? { page: 1 } : {}),
      },
    })),
  resetFilters: () => set({ filters: { page: 1 } }),
}))
