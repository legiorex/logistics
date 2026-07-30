import { useGetDictionaries } from '@/shared/api/generated/dictionaries'
import type { DictionaryItem } from '@/shared/api/generated/schemas'

// Справочники меняются редко — кэшируем надолго
export function useDictionaries() {
  return useGetDictionaries({
    query: { staleTime: Infinity },
  })
}

// Лейбл enum-значения из справочника; fallback — само значение
export function getDictLabel(
  items: DictionaryItem[] | undefined,
  value: string,
): string {
  return items?.find((item) => item.value === value)?.label ?? value
}
