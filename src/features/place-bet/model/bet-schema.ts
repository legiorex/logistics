import { z } from 'zod'

import type { Trading } from '@/shared/api/generated/schemas'
import {
  isGreaterThan,
  isGreaterThanZero,
  isLessThan,
  isPriceValidForStep,
} from '@/shared/lib/money'

// Схема формы ставки: цена > 0 и ограничения min/max/step из DTO торгов
export function createBetSchema(trading: Trading) {
  return z.object({
    price: z
      .number({ error: 'Введите цену' })
      .positive('Цена должна быть больше 0')
      .superRefine((price, ctx) => {
        if (trading.min !== null && trading.min !== undefined && isLessThan(price, trading.min)) {
          ctx.addIssue({
            code: 'custom',
            message: `Цена должна быть не меньше ${trading.min}`,
          })
        }
        if (trading.max !== null && trading.max !== undefined && isGreaterThan(price, trading.max)) {
          ctx.addIssue({
            code: 'custom',
            message: `Цена должна быть не больше ${trading.max}`,
          })
        }
        if (trading.step !== null && trading.step !== undefined && isGreaterThanZero(trading.step)) {
          if (!isPriceValidForStep(price, trading.step, trading.min)) {
            ctx.addIssue({
              code: 'custom',
              message: `Цена должна быть кратна шагу ${trading.step}`,
            })
          }
        }
      }),
  })
}

export type BetFormValues = z.infer<ReturnType<typeof createBetSchema>>
