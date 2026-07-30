import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auctions/$uuid/bets')({
  component: () => <div>Bets</div>,
})
