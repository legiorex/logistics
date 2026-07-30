# Бизнес-действие: установка ставки

Реализовать форму "Сделать ставку".

## Требования

- доступность формы зависит от `trading.can_set_bet`
- React Hook Form + Zod
- цена обязательна и больше 0
- учитывать `min`, `max`, `step`, если эти поля есть в detail DTO
- показывать подсказку по доступной цене и шагу ставки
- mutation вызывает `POST /auctions/{auctionUuid}/bets`
- после успеха инвалидируются list/detail/bets query
- MSW-store должен обновить текущую цену, статус пользователя и список ставок
- success/error toast
- обработка 422 validation error
