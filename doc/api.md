# API

Использовать endpoints из OpenAPI-схемы:

- `POST /auctions/list` — список аукционов
- `GET /auctions/{auctionUuid}` — детальная информация
- `GET /auctions/{auctionUuid}/bets` — список ставок
- `POST /auctions/{auctionUuid}/bets` — установить ставку

Backend писать не нужно. Нужно реализовать MSW-моки, которые соответствуют схеме и реально меняют состояние после мутаций.

Кандидат должен гарантировать точное соблюдение контрактов OpenAPI-схемы: структуры запросов/ответов, enum-значений, nullable-полей, ошибок и edge cases.
