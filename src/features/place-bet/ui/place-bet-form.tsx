import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'

import type { Auction } from '@/shared/api/generated/schemas'
import { Button } from '@/shared/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { formatPrice } from '@/shared/lib/format'
import { createBetSchema, type BetFormValues } from '../model/bet-schema'
import { usePlaceBetMutation } from '../model/use-place-bet'

interface PlaceBetFormProps {
  auction: Auction
}

export function PlaceBetForm({ auction }: PlaceBetFormProps) {
  const navigate = useNavigate()
  const { trading, uuid, availablePrice, betStep } = auction
  const mutation = usePlaceBetMutation(uuid)

  const form = useForm<BetFormValues>({
    resolver: zodResolver(createBetSchema(trading)),
    defaultValues: { price: availablePrice ?? undefined },
  })

  if (!trading.canSetBet) {
    return (
      <p className="text-sm text-muted-foreground">
        Установка ставок для этого аукциона недоступна.
      </p>
    )
  }

  const onSubmit = (values: BetFormValues) => {
    mutation.mutate(
      { auctionUuid: uuid, data: { price: values.price } },
      {
        onSuccess: () => {
          void navigate({ to: '/auctions/$uuid', params: { uuid } })
        },
      },
    )
  }

  const hints: string[] = []
  if (availablePrice !== null && availablePrice !== undefined) {
    hints.push(`Доступная цена: ${formatPrice(availablePrice)}`)
  }
  if (trading.min !== null && trading.min !== undefined) {
    hints.push(`мин. ${formatPrice(trading.min)}`)
  }
  if (trading.max !== null && trading.max !== undefined) {
    hints.push(`макс. ${formatPrice(trading.max)}`)
  }
  const step = trading.step ?? betStep
  if (step !== null && step !== undefined) {
    hints.push(`шаг ${formatPrice(step)}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Цена ставки, ₽</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={trading.step ?? betStep ?? 1}
                  placeholder="Введите цену"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(event) => field.onChange(event.target.valueAsNumber)}
                />
              </FormControl>
              {hints.length > 0 && (
                <FormDescription>{hints.join(' · ')}</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Отправка…' : 'Установить ставку'}
        </Button>
      </form>
    </Form>
  )
}
