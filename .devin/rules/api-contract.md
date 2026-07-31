---
trigger: always_on
---

<requirements>

# API Contract

OpenAPI-схема `openapi.auctions.v0.json` — единственный источник правды для API.
Соблюдение контракта обязательно: структуры запросов/ответов, enum-значения,
nullable-поля, ошибки, edge cases.

Схему **можно и нужно расширять**, если этого требует продуктовая задача
(например, добавление нового фильтра). Правится сам файл
`openapi.auctions.v0.json`, после чего код обязательно перегенерируется —
руками фичи/поля добавлять в клиент нельзя (см. "Code Generation").

## Endpoints

- `POST /auctions/list` — список аукционов (с фильтрами и пагинацией).
- `GET /auctions/{auctionUuid}` — детальная информация об аукционе.
- `GET /auctions/{auctionUuid}/bets` — список ставок по аукциону.
- `POST /auctions/{auctionUuid}/bets` — установить ставку.

### AuctionListRequest (фильтры списка)

- `search` — полнотекстовый поиск (номер заявки, город, груз).
- `cargoNum` — поиск по номеру заявки.
- `statuses` — массив статусов (`AuctionStatus[]`).
- `type` — тип аукциона (`AuctionType`).
- `loadCity` / `unloadCity` — город погрузки/выгрузки.
- `loadDateFrom` / `loadDateTo` — диапазон дат погрузки.
- `isAvailable` — только доступные аукционы.
- `isBidder` — только аукционы с моими ставками.
- `priceFrom` / `priceTo` — диапазон текущей цены.

## Code Generation

- API-клиент генерируется через Orval: `pnpm generate:api`.
- Конфигурация — в `orval.config.ts` (mode: `tags`, client: `react-query`,
  httpClient: `axios`).
- Сгенерированный код — в `src/shared/api/generated/`.
- **Запрещено** вручную редактировать файлы в `src/shared/api/generated/`.
- При изменении OpenAPI-схемы — перегенерировать код, не править руками.

## Contract Compliance

- Структуры запросов и ответов должны точно соответствовать схеме.
- Enum-значения использовать только из схемы, не хардкодить.
- Nullable-поля обрабатывать явно (проверка на `null`/`undefined`).
- Ошибки обрабатывать согласно схеме (коды ошибок, форматы).
- Edge cases (пустые списки, скрытые поля, недоступные действия) — по DTO-флагам.

## DTO Flags

- `can_set_bet` — определяет доступность формы установки ставки.
- `hide_bets_history` — скрывает историю ставок.
- `hide_points_address_and_contacts` — скрывает адреса точек и контакты.
- `no_view_cargo_price` — скрывает цену груза.

</requirements>
