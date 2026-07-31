import { useCallback, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useCopyToClipboard } from 'usehooks-ts'
import { toast } from 'sonner'

import type { Auction } from '@/shared/api/generated/schemas'
import { Button } from '@/shared/ui/button'
import { useDictionaries } from '@/entities/dictionary'
import {
  AuctionBadges,
  isPriceVisible,
} from '@/entities/auction'
import { TradingSection } from './trading-section'
import { CargoSection } from './cargo-section'
import { RouteSection } from './route-section'
import { OrganizerSection } from './organizer-section'

// Детальная страница аукциона: все секции с учётом DTO-флагов
type AuctionDetailsWidgetProps = {
  auction: Auction
}

export function AuctionDetailsWidget({ auction }: AuctionDetailsWidgetProps) {
  const { data: dictionaries } = useDictionaries()
  const { trading } = auction
  const [, copy] = useCopyToClipboard()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const showContacts =
    !trading.hidePointsAddressAndContacts && !auction.organizer.isContactsHidden
  const showPrice = isPriceVisible(auction)

  const handleCopy = useCallback((value: string, label: string) => {
    if (!value || value === '—') return
    copy(value)
      .then(() => {
        setCopiedField(label)
        toast.success(`Скопировано: ${label}`)
        setTimeout(() => setCopiedField(null), 2000)
      })
      .catch(() => toast.error('Не удалось скопировать'))
  }, [copy])

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <AuctionBadges auction={auction} />
        <h1 className="text-2xl font-semibold">
          Заявка № {auction.requestNumber}
        </h1>
        <div className="flex flex-wrap gap-2">
          {auction.trading.canSetBet && (
            <Button asChild>
              <Link to="/auctions/$uuid/place-bet" params={{ uuid: auction.uuid }}>
                {auction.hasMyBet ? 'Изменить ставку' : 'Сделать ставку'}
              </Link>
            </Button>
          )}
          {!auction.trading.hideBetsHistory && (
            <Button asChild variant="outline">
              <Link to="/auctions/$uuid/bets" params={{ uuid: auction.uuid }}>
                Смотреть ставки
              </Link>
            </Button>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TradingSection auction={auction} dictionaries={dictionaries} showPrice={showPrice} />
        <CargoSection auction={auction} dictionaries={dictionaries} />
        <RouteSection auction={auction} hideAddresses={trading.hidePointsAddressAndContacts} />
        <OrganizerSection
          auction={auction}
          dictionaries={dictionaries}
          showContacts={showContacts}
          copiedField={copiedField}
          onCopy={handleCopy}
        />
      </div>
    </div>
  )
}
