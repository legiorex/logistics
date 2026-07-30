---
trigger: always_on
---

<requirements>

# Technical Constraints & Service Boundaries

## Stack

- React 19 + TypeScript 6 + Vite 8 (SPA, не SSR).
- TanStack Router — маршрутизация с file-based routes и auto-code-splitting.
- TanStack Query — server state, кэширование, мутации, инвалидация.
- React Hook Form + Zod — формы и валидация.
- Tailwind CSS 4 + shadcn/ui (new-york) — стилизация и UI-компоненты.
- Orval — генерация API-клиента из OpenAPI-схемы (`react-query` client, `fetch` http).
- MSW — моки API в dev-режиме (`import.meta.env.DEV`).
- Zustand — точечный клиентский UI-state.
- ESLint — линтинг.
- PNPM — пакетный менеджер.

## Architecture boundaries

- Feature-Sliced Design (FSD): слои `app` → `pages` → `widgets` → `features` →
  `entities` → `shared`. Верхние слои импортируют из нижних, не наоборот.
- Каждый слайс имеет public API (index-файлы). Внутренние файлы не импортируются напрямую.
- `shared` — переиспользуемый код: UI-компоненты, утилиты, конфигурация, API-клиент.
- `entities` — бизнес-сущности (аукцион, ставка).
- `features` — бизнес-фичи (установка ставки, фильтрация списка).
- `widgets` — композиция сущностей и фич для конкретных участков страницы.
- `pages` — композиция виджетов для конкретных маршрутов.
- `app` — инициализация приложения (роутер, провайдеры, глобальные стили).

## API & Mocking

- API-клиент генерируется через Orval из `openapi.auctions.v0.json`.
- Сгенерированный код — в `src/shared/api/generated/`. Ручное редактирование запрещено.
- MSW-моки соответствуют OpenAPI-контракту: структуры запросов/ответов, enum-значения,
  nullable-поля, ошибки, edge cases.
- MSW-моки работают только в dev-режиме (`import.meta.env.DEV`).
- MSW-store должен реально обновлять состояние после мутаций (ставки).

## Routing

- TanStack Router с file-based routes (`src/routes/`).
- `src/routeTree.gen.ts` — автогенерация, не редактировать вручную.
- Prefetch детальной страницы по intent/hover.
- Search params с Zod-валидацией и безопасными fallback-значениями.

## Logging & Security

- Не логировать секреты, токены, чувствительные данные.
- Обработка ошибок на уровне TanStack Query (error boundaries, toast).

</requirements>
