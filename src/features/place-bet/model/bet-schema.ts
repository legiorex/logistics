import { z } from 'zod'

import type { Trading } from '@/shared/api/generated/schemas'
import { isPriceValidForStep } from '@/shared/lib/money'

// Проверка, что значение задано (не null и не undefined)
function isSet(value: number | null | undefined): value is number {
  return value !== null && value !== undefined
}

// Схема формы ставки: цена > 0 и ограничения min/max/step из DTO торгов
export function createBetSchema(trading: Trading) {
  const { min, max, step } = trading

  const hasMin = isSet(min)
  const hasMax = isSet(max)
  const hasStep = isSet(step) && step > 0

  return z.object({
    price: z
      .number({ error: 'Введите цену' })
      .positive('Цена должна быть больше 0')
      .superRefine((price, ctx) => {
        const addError = (message: string) => ctx.addIssue({ code: 'custom', message })

        if (hasMin && price < min) {
          addError(`Цена должна быть не меньше ${min}`)
        }
        if (hasMax && price > max) {
          addError(`Цена должна быть не больше ${max}`)
        }
        if (hasStep && !isPriceValidForStep(price, step, min)) {
          addError(`Цена должна быть кратна шагу ${step}`)
        }
      }),
  })
}

export type BetFormValues = z.infer<ReturnType<typeof createBetSchema>>
