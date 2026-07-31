import { useMemo } from 'react'

import type { Auction } from '@/shared/api/generated/schemas'
import { useDictionaries, getDictLabel } from '@/entities/dictionary'
import { Section } from './section'
import { Row } from './row'
import { CopyableRow } from './copyable-row'

export function OrganizerSection({
  auction,
  dictionaries,
  showContacts,
  copiedField,
  onCopy,
}: {
  auction: Auction
  dictionaries: ReturnType<typeof useDictionaries>['data']
  showContacts: boolean
  copiedField: string | null
  onCopy: (value: string, label: string) => void
}) {
  const contactsRows = useMemo(() => {
    if (!showContacts || !auction.organizer.contacts) {
      return <Row label="Контакты" value="Скрыты организатором" />
    }
    const phone = auction.organizer.contacts.phone ?? '—'
    const email = auction.organizer.contacts.email ?? '—'
    return (
      <>
        <CopyableRow
          label="Телефон"
          value={phone}
          copied={copiedField === 'Телефон'}
          onCopy={() => onCopy(phone, 'Телефон')}
        />
        <CopyableRow
          label="Email"
          value={email}
          copied={copiedField === 'Email'}
          onCopy={() => onCopy(email, 'Email')}
        />
      </>
    )
  }, [showContacts, auction.organizer.contacts, copiedField, onCopy])

  return (
    <Section title="Организатор и оплата">
      <Row label="Организатор" value={auction.organizer.name} />
      <CopyableRow
        label="ИНН"
        value={auction.organizer.inn}
        copied={copiedField === 'ИНН'}
        onCopy={() => onCopy(auction.organizer.inn, 'ИНН')}
      />
      {contactsRows}
      <Row
        label="Тип оплаты"
        value={getDictLabel(dictionaries?.paymentTypes, auction.paymentTerms.type)}
      />
      <Row label="Отсрочка" value={`${auction.paymentTerms.delayDays} дн.`} />
      <Row label="НДС" value={auction.paymentTerms.withoutVat ? 'Без НДС' : 'С НДС'} />
    </Section>
  )
}
