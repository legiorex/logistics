import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useCopyToClipboard } from 'usehooks-ts'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'

import type { Auction } from '@/shared/api/generated/schemas'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import {
  formatDateRange,
  formatPrice,
  formatVolume,
  formatWeight,
} from '@/shared/lib/format'
import { useDictionaries, getDictLabel } from '@/entities/dictionary'
import {
  AuctionBadges,
  isPriceVisible,
} from '@/entities/auction'

// Детальная страница аукциона: все секции с учётом DTO-флагов
export function AuctionDetailsWidget({ auction }: { auction: Auction }) {
  const { data: dictionaries } = useDictionaries()
  const { trading } = auction
  const [, copy] = useCopyToClipboard()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const showContacts =
    !trading.hidePointsAddressAndContacts && !auction.organizer.isContactsHidden
  const showPrice = isPriceVisible(auction)

  const handleCopy = (value: string, label: string) => {
    if (!value || value === '—') return
    copy(value)
      .then(() => {
        setCopiedField(label)
        toast.success(`Скопировано: ${label}`)
        setTimeout(() => setCopiedField(null), 2000)
      })
      .catch(() => toast.error('Не удалось скопировать'))
  }

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

        <Section title="Груз и ТС">
          <Row label="Груз" value={auction.cargo.name} />
          <Row label="Вес" value={formatWeight(auction.cargo.weightKg)} />
          <Row label="Объём" value={formatVolume(auction.cargo.volumeM3)} />
          <Row
            label="Тип кузова"
            value={getDictLabel(dictionaries?.bodyTypes, auction.cargo.bodyType)}
          />
          <Row
            label="Погрузка"
            value={formatDateRange(auction.dates.loadDateFrom, auction.dates.loadDateTo)}
          />
          <Row
            label="Выгрузка"
            value={formatDateRange(auction.dates.unloadDateFrom, auction.dates.unloadDateTo)}
          />
        </Section>

        <Section title="Маршрут">
          <ul className="flex flex-col gap-2">
            {auction.points.map((point, index) => (
              <li key={index} className="flex flex-col">
                <span className="text-sm font-medium">
                  {point.type === 'load' ? 'Погрузка' : 'Выгрузка'} — {point.city}
                </span>
                {!trading.hidePointsAddressAndContacts && point.address && (
                  <span className="text-sm text-muted-foreground">
                    {point.address}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Организатор и оплата">
          <Row label="Организатор" value={auction.organizer.name} />
          <CopyableRow
            label="ИНН"
            value={auction.organizer.inn}
            copied={copiedField === 'ИНН'}
            onCopy={() => handleCopy(auction.organizer.inn, 'ИНН')}
          />
          {showContacts && auction.organizer.contacts ? (
            (() => {
              const phone = auction.organizer.contacts.phone ?? '—'
              const email = auction.organizer.contacts.email ?? '—'
              return (
                <>
                  <CopyableRow
                    label="Телефон"
                    value={phone}
                    copied={copiedField === 'Телефон'}
                    onCopy={() => handleCopy(phone, 'Телефон')}
                  />
                  <CopyableRow
                    label="Email"
                    value={email}
                    copied={copiedField === 'Email'}
                    onCopy={() => handleCopy(email, 'Email')}
                  />
                </>
              )
            })()
          ) : (
            <Row label="Контакты" value="Скрыты организатором" />
          )}
          <Row
            label="Тип оплаты"
            value={getDictLabel(dictionaries?.paymentTypes, auction.paymentTerms.type)}
          />
          <Row label="Отсрочка" value={`${auction.paymentTerms.delayDays} дн.`} />
          <Row label="НДС" value={auction.paymentTerms.withoutVat ? 'Без НДС' : 'С НДС'} />
        </Section>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col gap-2 text-sm">{children}</dl>
      </CardContent>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}

function CopyableRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string
  value: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-1.5 text-right font-medium">
        {value}
        {value !== '—' && (
          <button
            type="button"
            onClick={onCopy}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`Скопировать ${label}`}
          >
            {copied ? (
              <Check className="size-3.5 text-green-600" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
        )}
      </dd>
    </div>
  )
}
