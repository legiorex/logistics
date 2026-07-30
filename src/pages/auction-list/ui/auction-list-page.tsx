import { AuctionListWidget } from '@/widgets/auction-list'

export function AuctionListPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Аукционы</h1>
      <AuctionListWidget />
    </div>
  )
}
