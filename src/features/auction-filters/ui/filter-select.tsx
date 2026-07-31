import { memo } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { FilterField } from './filter-field'

const ALL = 'all'

interface FilterSelectOption {
  value: string
  label: string
}

interface FilterSelectProps {
  label: string
  placeholder: string
  value: string | undefined
  options: FilterSelectOption[]
  onChange: (value: string | undefined) => void
}

// Select-фильтр с опцией «Все»: value=undefined → ALL, иначе реальное значение
export const FilterSelect = memo(function FilterSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <FilterField label={label}>
      <Select
        value={value ?? ALL}
        onValueChange={(v) => onChange(v === ALL ? undefined : v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterField>
  )
})
