import BigNumber from 'bignumber.js'

import { moneyFormat } from './money'

export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${new BigNumber(value).toFormat(0, undefined, moneyFormat)}\u00A0₽`
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  const bn = new BigNumber(value)
  const dp = bn.isInteger() ? 0 : 2
  return bn.toFormat(dp, undefined, moneyFormat)
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
  return `${formatNumber(weightKg)} кг`
}

export function formatVolume(volumeM3: number): string {
  return `${formatNumber(volumeM3)} м³`
}
