import { create } from 'zustand'

// Точечный клиентский UI-state: видимость панели фильтров (на mobile — drawer)
interface UiState {
  isFiltersOpen: boolean
  setFiltersOpen: (open: boolean) => void
  toggleFilters: () => void
}

export const useUiStore = create<UiState>()((set) => ({
  isFiltersOpen: false,
  setFiltersOpen: (open) => set({ isFiltersOpen: open }),
  toggleFilters: () => set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
}))
