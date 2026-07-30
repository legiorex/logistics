import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auctions/$uuid')({
  component: () => <div>Auction detail</div>,
})
