---
trigger: always_on
---

<requirements>

# MSW Mocking

MSW (Mock Service Worker) используется для мокирования API в dev-режиме.
Backend не пишется — все API-вызовы перехватываются MSW.

## Activation

- MSW работает только в dev-режиме (`import.meta.env.DEV`).
- Инициализация — в `src/main.tsx` через `enableMocking()`.
- Worker стартует перед рендером приложения.

## Contract Compliance

- Моки должны соответствовать OpenAPI-схеме `openapi.auctions.v0.json`.
- Структуры ответов: поля, типы, enum-значения, nullable — точно по схеме.
- Обработка ошибок: возвращать корректные статус-коды и форматы ошибок.
- Edge cases: пустые списки, скрытые поля (DTO-флаги), недоступные действия.

## State Management

- MSW-store — in-memory хранилище состояния моков.
- После мутации (установка ставки) store должен обновить:
  - текущую цену аукциона,
  - торговый статус пользователя,
  - список ставок.
- Состояние должно быть консистентным между разными endpoints.

## Endpoints to Mock

- `POST /auctions/list` — список с фильтрами и пагинацией.
- `GET /auctions/{auctionUuid}` — детальная информация.
- `GET /auctions/{auctionUuid}/bets` — список ставок.
- `POST /auctions/{auctionUuid}/bets` — установка ставки (mutation).

## Validation Errors

- `POST /auctions/{auctionUuid}/bets` с невалидными данными → 422 validation error.
- Формат ошибки должен соответствовать OpenAPI-схеме.

</requirements>
