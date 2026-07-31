
import BigNumber from 'bignumber.js'

// Конфигурация формата для ru-RU: разделитель групп — неразрывный пробел, десятичный разделитель — запятая
export const moneyFormat = {
  groupSeparator: '\u00A0',
  groupSize: 3,
  decimalSeparator: ',',
}

// Ставка НДС 20%
const VAT_RATE = 1.2

// Расчёт цены с НДС (20%). Если withoutVat = true — возвращаем цену без изменений
export function calculatePriceWithVat(price: number, withoutVat: boolean): number {
  if (withoutVat) return price
  return new BigNumber(price)
    .times(VAT_RATE)
    .integerValue(BigNumber.ROUND_HALF_UP)
    .toNumber()
}

// Проверка кратности цены шагу ставки: (price - base) % step должно быть ~0
export function isPriceValidForStep(
  price: number,
  step: number | null | undefined,
  min: number | null | undefined,
): boolean {
  if (step === null || step === undefined || step <= 0) return true
  const base = min !== null && min !== undefined ? min : 0
  return new BigNumber(price).minus(base).mod(step).isEqualTo(0)
}
