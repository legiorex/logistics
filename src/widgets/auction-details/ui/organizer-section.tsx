import { useCallback, memo } from 'react'

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

export const OrganizerSection = memo(function OrganizerSection({
  auction,
  dictionaries,
  showContacts,
  copiedField,
  onCopy,
}: OrganizerSectionProps) {
  const contacts = auction.organizer.contacts
  const showContactRows = showContacts && contacts

  const handleCopyInn = useCallback(
    () => onCopy(auction.organizer.inn, 'ИНН'),
    [onCopy, auction.organizer.inn],
  )
  const handleCopyPhone = useCallback(
    () => onCopy(contacts?.phone ?? '—', 'Телефон'),
    [onCopy, contacts?.phone],
  )
  const handleCopyEmail = useCallback(
    () => onCopy(contacts?.email ?? '—', 'Email'),
    [onCopy, contacts?.email],
  )

  return (
    <Section title="Организатор и оплата">
      <Row label="Организатор" value={auction.organizer.name} />
      <CopyableRow
        label="ИНН"
        value={auction.organizer.inn}
        copied={copiedField === 'ИНН'}
        onCopy={handleCopyInn}
      />
      {!showContactRows && <Row label="Контакты" value="Скрыты организатором" />}
      {showContactRows && (
        <>
          <CopyableRow
            label="Телефон"
            value={contacts.phone ?? '—'}
            copied={copiedField === 'Телефон'}
            onCopy={handleCopyPhone}
          />
          <CopyableRow
            label="Email"
            value={contacts.email ?? '—'}
            copied={copiedField === 'Email'}
            onCopy={handleCopyEmail}
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
})
