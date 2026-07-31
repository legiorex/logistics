import BigNumber from 'bignumber.js'
import { format, isValid, parseISO } from 'date-fns'

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
  const date = parseISO(value)
  if (!isValid(date)) return '—'
  return format(date, 'dd.MM.yyyy')
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = parseISO(value)
  if (!isValid(date)) return '—'
  return format(date, 'dd.MM.yyyy HH:mm')
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
