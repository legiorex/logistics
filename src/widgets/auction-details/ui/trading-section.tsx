import type { Auction } from '@/shared/api/generated/schemas'
import { formatPrice } from '@/shared/lib/format'
import { useDictionaries, getDictLabel } from '@/entities/dictionary'
import { Section } from './section'
import { Row } from './row'

export function TradingSection({
  auction,
  dictionaries,
  showPrice,
}: {
  auction: Auction
  dictionaries: ReturnType<typeof useDictionaries>['data']
  showPrice: boolean
}) {
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
        value={
          auction.hasMyBet
            ? getDictLabel(
                dictionaries?.userTradingStatuses,
                auction.userTradingStatus ?? 'NotParticipant',
              )
            : 'Нет'
        }
      />
    </Section>
  )
}
