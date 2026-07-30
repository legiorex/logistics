import { z } from 'zod'

import type { Trading } from '@/shared/api/generated/schemas'

// Схема формы ставки: цена > 0 и ограничения min/max/step из DTO торгов
export function createBetSchema(trading: Trading) {
  return z.object({
    price: z
      .number({ error: 'Введите цену' })
      .positive('Цена должна быть больше 0')
      .superRefine((price, ctx) => {
        if (trading.min !== null && trading.min !== undefined && price < trading.min) {
          ctx.addIssue({
            code: 'custom',
            message: `Цена должна быть не меньше ${trading.min}`,
          })
        }
        if (trading.max !== null && trading.max !== undefined && price > trading.max) {
          ctx.addIssue({
            code: 'custom',
            message: `Цена должна быть не больше ${trading.max}`,
          })
        }
        if (trading.step !== null && trading.step !== undefined && trading.step > 0) {
          const base =
            trading.min !== null && trading.min !== undefined ? trading.min : 0
          const remainder = (price - base) % trading.step
          if (Math.abs(remainder) > 1e-9 && Math.abs(remainder - trading.step) > 1e-9) {
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
