const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 2,
})

export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return priceFormatter.format(value)
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return numberFormatter.format(value)
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('ru-RU')
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateRange(from: string, to: string): string {
  return `${formatDate(from)} — ${formatDate(to)}`
}

export function formatWeight(weightKg: number): string {
  return `${numberFormatter.format(weightKg)} кг`
}

export function formatVolume(volumeM3: number): string {
  return `${numberFormatter.format(volumeM3)} м³`
}
