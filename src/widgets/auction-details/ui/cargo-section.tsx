import type { Auction } from '@/shared/api/generated/schemas'
import {
  formatDateRange,
  formatVolume,
  formatWeight,
} from '@/shared/lib/format'
import { useDictionaries, getDictLabel } from '@/entities/dictionary'
import { Section } from './section'
import { Row } from './row'

type CargoSectionProps = {
  auction: Auction
  dictionaries: ReturnType<typeof useDictionaries>['data']
}

export function CargoSection({
  auction,
  dictionaries,
}: CargoSectionProps) {
  return (
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
  )
}
