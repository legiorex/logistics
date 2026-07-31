import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'

import { usePlaceBet } from '@/shared/api/generated/bets'
import { getGetAuctionByUuidQueryKey } from '@/shared/api/generated/auctions'
import { getGetAuctionBetsQueryKey } from '@/shared/api/generated/bets'
import type { ErrorResponse } from '@/shared/api/generated/schemas'
import { auctionsListBaseKey } from '@/entities/auction'

// Мутация установки ставки: инвалидирует list/detail/bets и показывает toast
export function usePlaceBetMutation(auctionUuid: string) {
  const queryClient = useQueryClient()

  return usePlaceBet({
    mutation: {
      onSuccess: () => {
        toast.success('Ставка установлена')
        void queryClient.invalidateQueries({
          queryKey: getGetAuctionByUuidQueryKey(auctionUuid),
        })
        void queryClient.invalidateQueries({
          queryKey: getGetAuctionBetsQueryKey(auctionUuid),
        })
        void queryClient.invalidateQueries({
          queryKey: auctionsListBaseKey,
        })
      },
      onError: (error) => {
        // 422 и прочие ошибки — показываем сообщение из ErrorResponse
        const axiosError = error as AxiosError<ErrorResponse>
        const message =
          axiosError.response?.data?.message ?? 'Не удалось установить ставку'
        toast.error(message)
      },
    },
  })
}
