import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import type { Auction } from '@/shared/api/generated/schemas'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
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
  AuctionStatusBadge,
  AuctionTypeBadge,
  UserTradingStatusBadge,
} from './status-badges'

interface AuctionCardProps {
  auction: Auction
  onPrefetch?: () => void
}

export function AuctionCard({ auction, onPrefetch }: AuctionCardProps) {
  const { data: dictionaries } = useDictionaries()
  const {
    uuid,
    requestNumber,
    type,
    status,
    userTradingStatus,
    hasMyBet,
    route,
    dates,
    cargo,
    currentPrice,
    pricePerKm,
    betStep,
    trading,
  } = auction

  const showPrice = !trading.noViewCargoPrice

  return (
    <Card onMouseEnter={onPrefetch} className="flex flex-col">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <AuctionTypeBadge type={type} />
          <AuctionStatusBadge status={status} />
          {userTradingStatus && <UserTradingStatusBadge status={userTradingStatus} />}
          {hasMyBet && <MyBetFlag />}
        </div>
        <CardTitle>
          <Link
            to="/auctions/$uuid"
            params={{ uuid }}
            className="hover:underline"
          >
            Заявка № {requestNumber}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <span>{route.load}</span>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
          <span>{route.unload}</span>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
          <dt>Погрузка</dt>
          <dd className="text-right text-foreground">
            {formatDateRange(dates.loadDateFrom, dates.loadDateTo)}
          </dd>
          <dt>Выгрузка</dt>
          <dd className="text-right text-foreground">
            {formatDateRange(dates.unloadDateFrom, dates.unloadDateTo)}
          </dd>
          <dt>Груз</dt>
          <dd className="text-right text-foreground">{cargo.name}</dd>
          <dt>Параметры</dt>
          <dd className="text-right text-foreground">
            {formatWeight(cargo.weightKg)}, {formatVolume(cargo.volumeM3)},{' '}
            {getDictLabel(dictionaries?.bodyTypes, cargo.bodyType)}
          </dd>
          <dt>Текущая цена</dt>
          <dd className="text-right font-medium text-foreground">
            {showPrice ? formatPrice(currentPrice) : 'Скрыта'}
          </dd>
          <dt>Цена за км</dt>
          <dd className="text-right text-foreground">
            {showPrice ? formatPrice(pricePerKm) : '—'}
          </dd>
          <dt>Шаг ставки</dt>
          <dd className="text-right text-foreground">
            {showPrice ? formatPrice(betStep) : '—'}
          </dd>
        </dl>
      </CardContent>

      <CardFooter>
        <PrimaryActionButton auction={auction} />
      </CardFooter>
    </Card>
  )
}

function MyBetFlag() {
  return <span className="text-xs text-muted-foreground">Моя ставка есть</span>
}

function PrimaryActionButton({ auction }: { auction: Auction }) {
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
}
