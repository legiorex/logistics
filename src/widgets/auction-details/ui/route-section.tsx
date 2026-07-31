import type { Auction } from '@/shared/api/generated/schemas'
import { Section } from './section'

export function RouteSection({
  auction,
  hideAddresses,
}: {
  auction: Auction
  hideAddresses: boolean
}) {
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
}
