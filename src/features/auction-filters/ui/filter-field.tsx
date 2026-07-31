import type { ReactNode } from 'react'

import { Label } from '@/shared/ui/label'

interface FilterFieldProps {
  label: string
  htmlFor?: string
  children: ReactNode
}

// Обёртка поля фильтра: лейбл + контент с единым отступом
export function FilterField({ label, htmlFor, children }: FilterFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}
