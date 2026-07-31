# AGENTS.md

## Communication Language

- Always respond in Russian.
- Write all code comments in Russian.
- Keep explanations of changes short and concise.
- If information is unknown or insufficient, state it explicitly. Do not invent facts, APIs, libraries, or capabilities.

---

## Technology Stack

- React v19
- TypeScript v6
- Vite v8
- TanStack Router
- TanStack Query
- React Hook Form + Zod
- Tailwind CSS v4
- shadcn/ui (new-york style)
- Orval (code generation from OpenAPI)
- MSW (Mock Service Worker)
- Feature-Sliced Design (FSD)
- Zustand (точечный клиентский UI-state)
- Radix UI
- Lucide React (icons)
- PNPM
- ESLint

---

## Development Principles

Code must strictly follow the principles below.

### Core Principles

- SOLID
- DRY
- KISS

### Additional Principles

- Separation of Concerns (SoC)
- Single Source of Truth (SSOT)
- Composition over Inheritance
- Convention over Configuration
- Fail Fast
- Explicit is Better than Implicit
- YAGNI
- High Cohesion
- Low Coupling
- Immutability whenever practical
- Predictable Behavior
- Principle of Least Astonishment

---

## TypeScript

- Never use `any`.
- Prefer `unknown` over `any`.
- Use strict typing.
- Reuse existing project types before creating new ones.
- Avoid duplicate type definitions.
- Prefer `type` unless interface extension is required.
- Do not suppress type errors without a valid reason.
- Do not use `@ts-ignore` without explaining why.

---

## Working with Code

- Study the existing implementation before making changes.
- Follow the current project architecture.
- Follow existing project patterns and conventions.
- Do not refactor unrelated code.
- Change only what is required to solve the task.
- Prefer simple solutions over complex ones.
- Do not introduce abstractions without a clear need.
- Do not create new files when existing ones can be reused.

---

## Feature-Sliced Design

Follow FSD methodology and best practices.

### Structure

- Слои (от верхнего к нижнему): `app`, `pages`, `widgets`, `features`, `entities`, `shared`.
- Каждый слой имеет чёткую зону ответственности.
- Верхние слои могут импортировать из нижних, но не наоборот.
- Внутри слоя — сегменты (`ui`, `model`, `lib`, `api`, `config`).

### Rules

- Соблюдайте границы слоёв FSD.
- Не импортируйте из верхних слоёв в нижние (например, `shared` не должен импортировать из `features`).
- Используйте public API каждого слайса (index-файлы).
- Не импортируйте внутренние файлы слайса напрямую — только через его public API.
- Избегайте циклических зависимостей.
- Выносите переиспользуемый код в `shared`.
- Бизнес-сущности — в `entities`.
- Бизнес-фичи — в `features`.
- Композиция страниц — в `pages` и `widgets`.

### Path Aliases

- Используйте `@/` для импорта из `src/` (настроено в `tsconfig.app.json` и `vite.config.ts`).
- shadcn/ui aliases настроены в `components.json`:
  - `@/shared/ui` — компоненты
  - `@/shared/lib` — утилиты
  - `@/shared/lib/cn` — функция cn
  - `@/shared/lib/hooks` — хуки

---

## Dependencies

- Use the latest stable versions of libraries.
- Review existing project dependencies before adding new ones.
- Do not introduce a new dependency if the task can be solved with existing tools.
- All dependencies are managed through the root `package.json` (single-project setup).

---

## API & Code Generation

- API клиент генерируется через Orval из OpenAPI-схемы (`openapi.auctions.v0.json`).
- Конфигурация Orval — в `orval.config.ts`.
- Сгенерированный код находится в `src/shared/api/generated/`.
- **Запрещено** вручную редактировать файлы в `src/shared/api/generated/`.
- Для обновления API клиента используйте `pnpm generate:api`.
- Если продуктовая задача требует поля/фильтра, которого нет в схеме —
  правьте сам `openapi.auctions.v0.json` и перегенерируйте клиент. Изобретать
  поля напрямую в клиентском коде мимо схемы запрещено (см. "Prohibited").
- MSW-моки должны соответствовать OpenAPI-контракту.
- Моки работают только в dev-режиме (`import.meta.env.DEV`).

---

## Code Quality

Before completing a task:

1. Verify type safety.
2. Run ESLint checks.
3. Verify formatting.
4. Ensure there is no unused code.
5. Ensure there are no unused imports.
6. Verify backward compatibility of changes.

---

## Documentation

- Use official documentation whenever possible.
- Use documentation that matches the latest stable library versions.
- Consult documentation before implementation when in doubt.
- Do not rely on outdated examples.

---

## Planning Mode

When working in Planning Mode:

- Ask only one clarification question at a time.
- Never ask multiple questions in a single message.
- Ask the next question only after receiving an answer.
- Do not proceed to implementation until sufficient information is available.

---

## Solution Design

Before implementation:

1. Study the existing codebase.
2. Find similar implementations.
3. Assess the impact of the change.
4. Propose the smallest viable solution.
5. Only then proceed with implementation.

---

## Prohibited

- Using `any`.
- Ignoring type errors.
- Violating FSD layer boundaries.
- Creating circular dependencies.
- Adding unused dependencies.
- Inventing API fields/endpoints that bypass `openapi.auctions.v0.json` (extend the schema itself instead, then regenerate).
- Inventing library functionality.
- Inventing requirements that do not exist.
- Performing large-scale refactoring without explicit approval.
- Modifying code outside the scope of the task.
- Manually editing generated files in `src/shared/api/generated/`.
- Editing `src/routeTree.gen.ts` (auto-generated by TanStack Router).
