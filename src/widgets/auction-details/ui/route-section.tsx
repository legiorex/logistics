import { memo } from 'react'

import type { Auction } from '@/shared/api/generated/schemas'
import { Section } from './section'

type RouteSectionProps = {
  auction: Auction
  hideAddresses: boolean
}

export const RouteSection = memo(function RouteSection({
  auction,
  hideAddresses,
}: RouteSectionProps) {
  return (
    <Section title="Маршрут">
      <ul className="flex flex-col gap-2">
        {auction.points.map((point) => (
          <li key={`${point.type}-${point.city}`} className="flex flex-col">
            <span className="text-sm font-medium">
              {point.type === 'load' ? 'Погрузка' : 'Выгрузка'} — {point.city}
            </span>
            {!hideAddresses && point.address && (
              <span className="text-sm text-muted-foreground">
                {point.address}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  )
})
