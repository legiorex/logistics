import { createFileRoute, Outlet } from '@tanstack/react-router'

// Layout-роут: детальная страница живёт в index-роуте,
// bets и place-bet — вложенные и рендерятся через Outlet
export const Route = createFileRoute('/auctions/$uuid')({
  component: Outlet,
})
