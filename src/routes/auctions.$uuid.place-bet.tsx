import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auctions/$uuid/place-bet')({
  component: () => <div>Place bet</div>,
})
