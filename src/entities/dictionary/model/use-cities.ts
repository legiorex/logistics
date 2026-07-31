import { useGetCities } from '@/shared/api/generated/cities'

// Города меняются редко — кэшируем надолго
export function useCities() {
  return useGetCities({ query: { staleTime: Infinity } })
}
