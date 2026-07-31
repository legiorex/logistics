import { memo } from 'react'
import { Link } from '@tanstack/react-router'

import type { Auction } from '@/shared/api/generated/schemas'
import { Button } from '@/shared/ui/button'
import { useDictionaries, getDictLabel } from '@/entities/dictionary'

type PrimaryActionButtonProps = {
  auction: Auction
}

export const PrimaryActionButton = memo(function PrimaryActionButton({ auction }: PrimaryActionButtonProps) {
  const { data: dictionaries } = useDictionaries()
  const { uuid, primaryAction, trading } = auction

  if (!primaryAction || (primaryAction === 'make_bet' && !trading.canSetBet)) {
    return (
      <Button disabled className="w-full">
        Действие недоступно
      </Button>
    )
  }

  const label = getDictLabel(dictionaries?.primaryActions, primaryAction)

  if (primaryAction === 'view_bets') {
    return (
      <Button asChild variant="secondary" className="w-full">
        <Link to="/auctions/$uuid/bets" params={{ uuid }}>
          {label}
        </Link>
      </Button>
    )
  }

  return (
    <Button asChild className="w-full">
      <Link to="/auctions/$uuid/place-bet" params={{ uuid }}>
        {label}
      </Link>
    </Button>
  )
})
