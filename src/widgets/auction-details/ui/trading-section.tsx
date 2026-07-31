import type { Auction } from '@/shared/api/generated/schemas'
import { formatPrice } from '@/shared/lib/format'
import { useDictionaries, getDictLabel } from '@/entities/dictionary'
import { Section } from './section'
import { Row } from './row'
import { memo } from 'react'

function getMyBetLabel(
  auction: Auction,
  dictionaries: ReturnType<typeof useDictionaries>['data'],
): string {
  if (!auction.hasMyBet) return 'Нет'
  return getDictLabel(
    dictionaries?.userTradingStatuses,
    auction.userTradingStatus ?? 'NotParticipant',
  )
}

type TradingSectionProps = {
  auction: Auction
  dictionaries: ReturnType<typeof useDictionaries>['data']
  showPrice: boolean
}

export const TradingSection = memo(function TradingSection({
  auction,
  dictionaries,
  showPrice,
}: TradingSectionProps) {
  return (
    <Section title="Торги">
      <Row label="Текущая цена" value={showPrice ? formatPrice(auction.currentPrice) : 'Скрыта'} />
      <Row label="Доступная цена" value={showPrice ? formatPrice(auction.availablePrice) : '—'} />
      <Row label="Цена за км" value={showPrice ? formatPrice(auction.pricePerKm) : '—'} />
      <Row label="Мин. цена" value={showPrice ? formatPrice(auction.trading.min) : '—'} />
      <Row label="Макс. цена" value={showPrice ? formatPrice(auction.trading.max) : '—'} />
      <Row
        label="Шаг ставки"
        value={showPrice ? formatPrice(auction.trading.step ?? auction.betStep) : '—'}
      />
      <Row
        label="Моя ставка"
        value={getMyBetLabel(auction, dictionaries)}
      />
    </Section>
  )
})
