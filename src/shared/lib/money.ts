import BigNumber from 'bignumber.js'

// Конфигурация формата для ru-RU: разделитель групп — неразрывный пробел, десятичный разделитель — запятая
export const moneyFormat = {
  groupSeparator: '\u00A0',
  groupSize: 3,
  decimalSeparator: ',',
}

// Ставка НДС 20%
const VAT_RATE = 1.2

// Сложение
export function addMoney(a: number, b: number): number {
  return new BigNumber(a).plus(b).toNumber()
}

// Вычитание
export function subtractMoney(a: number, b: number): number {
  return new BigNumber(a).minus(b).toNumber()
}

// Остаток от деления
export function modMoney(a: number, b: number): number {
  return new BigNumber(a).mod(b).toNumber()
}

// Абсолютное значение
export function absMoney(a: number): number {
  return new BigNumber(a).abs().toNumber()
}

// Сравнение: a > b
export function isGreaterThan(a: number, b: number): boolean {
  return new BigNumber(a).isGreaterThan(b)
}

// Сравнение: a < b
export function isLessThan(a: number, b: number): boolean {
  return new BigNumber(a).isLessThan(b)
}

// Сравнение: a === b
export function isEqualTo(a: number, b: number): boolean {
  return new BigNumber(a).isEqualTo(b)
}

// Проверка: значение положительное
export function isPositiveMoney(value: number): boolean {
  return new BigNumber(value).isPositive()
}

// Проверка: значение больше нуля
export function isGreaterThanZero(value: number): boolean {
  return new BigNumber(value).isGreaterThan(0)
}

// Расчёт цены с НДС (20%). Если withoutVat = true — возвращаем цену без изменений
export function calculatePriceWithVat(price: number, withoutVat: boolean): number {
  if (withoutVat) return price
  return new BigNumber(price)
    .times(VAT_RATE)
    .integerValue(BigNumber.ROUND_HALF_UP)
    .toNumber()
}
