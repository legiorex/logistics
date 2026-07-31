import type { Auction } from '@/shared/api/generated/schemas'
import { useDictionaries, getDictLabel } from '@/entities/dictionary'
import { Section } from './section'
import { Row } from './row'
import { CopyableRow } from './copyable-row'

type OrganizerSectionProps = {
  auction: Auction
  dictionaries: ReturnType<typeof useDictionaries>['data']
  showContacts: boolean
  copiedField: string | null
  onCopy: (value: string, label: string) => void
}

export function OrganizerSection({
  auction,
  dictionaries,
  showContacts,
  copiedField,
  onCopy,
}: OrganizerSectionProps) {
  const contacts = auction.organizer.contacts
  const showContactRows = showContacts && contacts

  return (
    <Section title="Организатор и оплата">
      <Row label="Организатор" value={auction.organizer.name} />
      <CopyableRow
        label="ИНН"
        value={auction.organizer.inn}
        copied={copiedField === 'ИНН'}
        onCopy={() => onCopy(auction.organizer.inn, 'ИНН')}
      />
      {!showContactRows && <Row label="Контакты" value="Скрыты организатором" />}
      {showContactRows && (
        <>
          <CopyableRow
            label="Телефон"
            value={contacts.phone ?? '—'}
            copied={copiedField === 'Телефон'}
            onCopy={() => onCopy(contacts.phone ?? '—', 'Телефон')}
          />
          <CopyableRow
            label="Email"
            value={contacts.email ?? '—'}
            copied={copiedField === 'Email'}
            onCopy={() => onCopy(contacts.email ?? '—', 'Email')}
          />
        </>
      )}
      <Row
        label="Тип оплаты"
        value={getDictLabel(dictionaries?.paymentTypes, auction.paymentTerms.type)}
      />
      <Row label="Отсрочка" value={`${auction.paymentTerms.delayDays} дн.`} />
      <Row label="НДС" value={auction.paymentTerms.withoutVat ? 'Без НДС' : 'С НДС'} />
    </Section>
  )
}
