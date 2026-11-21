# hanibo

Платформа для изучения корейского языка: курс, словарь, грамматика, фразы,
алфавит, мини-игры, библиотека PDF, магазин, разборы манхвы/дорам, профиль,
достижения и уведомления.

Проект состоит из двух приложений:

- `frontend-web/` — SPA на React + TypeScript + Vite;
- `backend/` — REST API на Laravel + MySQL, работающий через Laravel Sail
  (Docker Compose).

Подробный отчёт о проверке кода, найденных проблемах и фактическом состоянии
чек-листа — в [AUDIT.md](AUDIT.md).

## Содержание

- [Что уже работает](#что-уже-работает)
- [Технологии](#технологии)
- [Структура](#структура)
- [Быстрый старт](#быстрый-старт)
- [Окружение](#окружение)
- [Миграции и сидеры](#миграции-и-сидеры)
- [Аутентификация и безопасность](#аутентификация-и-безопасность)
- [API](#api)
- [Курс: прогресс и награды](#курс-прогресс-и-награды)
- [SRS, серия и уровень](#srs-серия-и-уровень)
- [Достижения и уведомления](#достижения-и-уведомления)
- [Разборы](#разборы)
- [Frontend](#frontend)
- [Проверки](#проверки)
- [Ограничения и планы](#ограничения-и-планы)
- [Если что-то не запускается](#если-что-то-не-запускается)

## Что уже работает

### Курс (`/course`)

- вкладки **Курс**, **Тренировки**, **Мой словарь**, **Статистика**;
- уроки, дополнительные материалы и общие тесты;
- урок: слова → грамматика → итоговый тест;
- тесты с разными типами вопросов;
- повторение по последним урокам и работа над ошибками;
- серверный прогресс курса и награды за пройденные элементы;
- статистика курса, уровень языка и серия.

### Практика (`/practice`)

- алфавит: гласные, согласные, дифтонги, ассимиляция, статистика;
- тренажёр написания букв;
- грамматика с фильтрами и модальным разбором;
- словарь и фразы с SRS, фильтрами и озвучкой;
- слово/фраза дня, ежедневные квизы;
- мини-игры для слов и фраз;
- достижения и уведомления.

### Библиотека (`/library`)

- каталог книг и учебных материалов;
- поиск, фильтры и сортировка, состояние фильтров в URL;
- продолжение чтения и недавно открытые;
- PDF-вьюер: страницы, миниатюры, оглавление, масштаб, 1/2 страницы;
- доступ для гостя.

### Разборы (`/breakdowns`)

- внутренние вкладки **Главная / Каталог / Аккаунт**;
- карточки манхвы и дорам с обновлениями;
- учебный экран:
  - манхва — кадры и реплики, перевод, слова, грамматика;
  - дорама — видеоплеер, транскрипт с таймкодами и разбор;
- сохранение фраз и прогресса в аккаунте (локально).

Сейчас разборы — **демо-контент**: реальной медиамодели на бэкенде нет,
видео-URL демонстрационный. Это отмечено в интерфейсе и AUDIT.

### Профиль (`/profile`)

- полная статистика: уровень, серия, заморозки, цель дня;
- слова/фразы/грамматика/алфавит;
- прогресс курса, разборов и библиотеки;
- баланс черники/клубники;
- превью 6 достижений и ссылка на полную коллекцию;
- вкладка **Настройки**: аккаунт, тема, дневная цель, часовой пояс,
  уведомления, смена пароля, выход и выход на всех устройствах.

### Достижения (`/achievements`)

- категории: алфавит, курс, практика, разборы, библиотека, магазин,
  активность;
- фильтры по категории и статусу;
- секретные достижения с закрытым описанием;
- награды в чернике;
- на страницах разделов есть компактная полоса достижений.

### Уведомления

- in-app центр в профиле: история, непрочитанные, очистка;
- toast при новом событии;
- уведомления о достижениях, серии и дневной цели;
- настройки отключают категории;
- опционально — системные уведомления браузера с разрешением.

### Магазин (`/shop`)

- косметика: аватары, рамки, баннеры, статусы, медали, ники, иконки;
- бустеры опыта и заморозки;
- покупка, применение, снятие, активация.

### Админка (`/admin`)

- только для пользователей с ролью `admin`;
- обзор: пользователи, элементы курса, слова, фразы, грамматика,
  библиотека, советы, достижения и магазин;
- пользователи: поиск, роль, сброс прогресса;
- курс: название, порядок и уровень элементов;
- грамматика: создание, редактирование и удаление правил;
- библиотека: создание, редактирование и удаление материалов;
- советы и факты: CRUD;
- достижения: просмотр;
- логи: последние 200 строк `laravel.log`.

Создание администратора — через `AdminUserSeeder` и переменные
`ADMIN_EMAIL` / `ADMIN_PASSWORD` в `backend/.env`. В репозитории нет готового
пароля: задайте свои значения и выполните `db:seed`. Не коммитьте `.env` и не
используйте одинаковый пароль в продакшене.

### Гость

- главная, курс, разборы и библиотека доступны без входа;
- практика, магазин, профиль и достижения требуют аккаунт;
- прогресс курса гостя хранится в `localStorage`;
- на `/login` есть «Продолжить как гость».

## Технологии

### Frontend

| Технология | Версия |
|---|---|
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| SCSS / sass-embedded | 1.105 |
| React Router | 7 |
| Framer Motion | 14 |
| Axios | 1.20 |
| React PDF | 11 |
| React Markdown + remark-gfm | 10 / 4 |
| lucide-react | 1.48 |
| hangul-writer | 1.0 |
| canvas-confetti | 1.9 |
| react-hotkeys-hook | 5 |

Шрифты: `@fontsource/noto-sans-kr` и Nunito.

### Backend

- PHP 8.5 в Sail-образе, Laravel 13;
- Laravel Sanctum;
- MySQL 8.4;
- Redis в Compose;
- PHPUnit, Pint, Tinker;
- Laravel Sail / Docker Compose.

## Структура

```text
hanibo/
├── README.md
├── AUDIT.md
├── frontend-web/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── pdfjs/
│   ├── src/
│   │   ├── api/            # axios-клиенты и типы API
│   │   ├── assets/         # изображения
│   │   ├── components/     # общие компоненты
│   │   ├── config/         # API_BASE_URL
│   │   ├── context/        # Auth, Theme, Achievements, Notifications
│   │   ├── layouts/        # MainLayout, Sidebar, Banner, MobileNav
│   │   ├── lib/            # речь, PDF, recent, настройки, прогресс
│   │   ├── pages/          # страницы и блоки
│   │   ├── styles/         # SCSS
│   │   ├── types/          # доменные типы
│   │   └── utils/          # генераторы тестов, SRS, прогресс
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── backend/
    ├── app/
    │   ├── Http/Controllers/   # API, Auth, Shop
    │   ├── Http/Resources/
    │   ├── Models/             # User, CourseItem, Word, ...
    │   └── Services/           # Streak, Achievement
    ├── database/
    │   ├── migrations/
    │   └── seeders/
    ├── routes/api.php
    ├── compose.yaml
    └── .env.example
```

## Быстрый старт

### Требования

- Node.js 22+ и npm;
- Docker и Docker Compose;
- Composer (для установки PHP-зависимостей);
- WSL2 на Windows рекомендуется.

### 1. Backend

```bash
cd backend

cp .env.example .env
# Для Sail замените SQLite-блок на MySQL:
# DB_CONNECTION=mysql
# DB_HOST=mysql
# DB_PORT=3306
# DB_DATABASE=hanibo
# DB_USERNAME=sail
# DB_PASSWORD=password

composer install
docker compose up -d --build

docker compose exec laravel.test php artisan key:generate
docker compose exec laravel.test php artisan migrate
docker compose exec laravel.test php artisan db:seed
docker compose exec laravel.test php artisan storage:link
docker compose exec laravel.test php artisan optimize:clear
```

API: `http://localhost/api`.

> **Важно:** `php artisan` запускайте только в контейнере
> `docker compose exec laravel.test ...`. PHP на хосте может не иметь
> `pdo_mysql`, а `DB_HOST=mysql` доступен только внутри Docker-сети.

### 2. Frontend

```bash
cd frontend-web
npm ci
npm run dev
```

Vite покажет Local/Network URL. Откройте Network-адрес, например
`http://<IP>:5173/`. Если порт занят, Vite выберет 5174/5175 и т.д.

### 3. Прокси API

В `frontend-web/vite.config.ts`:

```ts
const proxyConfig = {
  "/api": {
    target: "http://192.168.0.15",
    changeOrigin: true,
    secure: false,
  },
};
```

Замените target на адрес вашего backend:

- Docker на этой же машине: `http://127.0.0.1`;
- другая машина: `http://<IP>:<PORT>`.

После изменения перезапустите `npm run dev`.

## Окружение

### Backend `.env`

```env
APP_NAME=hanibo
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=hanibo
DB_USERNAME=sail
DB_PASSWORD=password

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

MAIL_MAILER=log
MAIL_FROM_ADDRESS=hello@example.com
MAIL_FROM_NAME="${APP_NAME}"

# Задайте свои значения и запустите AdminUserSeeder
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me

WWWUSER=1000
WWWGROUP=1000
```

`FRONTEND_URL` используется в ссылке сброса пароля. Для реальной отправки
писем настройте SMTP/Postmark/Resend и уберите `MAIL_MAILER=log`.

### Frontend

Отдельного `.env` нет: API всегда идёт через относительный `/api`, прокси
настраивается в `vite.config.ts`.

## Миграции и сидеры

Основные данные:

```bash
docker compose exec laravel.test php artisan migrate
docker compose exec laravel.test php artisan db:seed
```

`DatabaseSeeder` запускает словарь, курс, контент уроков и привязку тестов
курса к урокам.

Дополнительные сидеры:

```bash
docker compose exec laravel.test php artisan db:seed --class=AlphabetSeeder
docker compose exec laravel.test php artisan db:seed --class=AlphabetAssimilationSeeder
docker compose exec laravel.test php artisan db:seed --class=GrammarSeeder
docker compose exec laravel.test php artisan db:seed --class=LibraryItemSeeder
docker compose exec laravel.test php artisan db:seed --class=ShopItemSeeder
docker compose exec laravel.test php artisan db:seed --class=TipSeeder
docker compose exec laravel.test php artisan db:seed --class=AchievementSeeder
docker compose exec laravel.test php artisan db:seed --class=TitleSeeder
```

Некоторые сидеры создают записи, а не обновляют их. На чистой БД запускайте
полный набор один раз.

## Аутентификация и безопасность

- регистрация: никнейм, email, пароль (8+, верхний/нижний регистр, цифра);
- вход по **email или никнейму**;
- access-токен Sanctum — 30 минут;
- refresh-токен — 30 дней, хранится в **httpOnly-cookie** и ротируется;
- при 401 клиент автоматически обновляет access-токен и повторяет запрос;
- logout удаляет refresh-токен и текущий access-токен;
- logout-all удаляет все сессии пользователя;
- login/register/refresh имеют rate limit;
- на клиенте после 3 неудачных входов — блокировка на 30 секунд;
- сброс пароля: одноразовый токен, TTL 1 час, хеш в БД;
- после сброса/смены пароля старые access/refresh-токены отзываются.

Ограничения:

- access-токен всё ещё хранится в `localStorage`; refresh-cookie защищает
  лучше, но XSS-риск остаётся;
- CSP и продакшен-CORS не настроены;
- dev-сервер слушает `0.0.0.0`;
- старый `hanibo.sql` мог остаться в истории Git с PII — см. AUDIT.

## API

Все ответы JSON. Защищённые запросы:

```http
Authorization: Bearer <access-token>
```

Refresh-cookie передаётся браузером автоматически.

### Публичные

| Метод | Путь | Назначение |
|---|---|---|
| GET | `/api/ping` | Проверка API |
| GET | `/api/tips/random` | Случайный совет/факт |
| GET | `/api/course/items` | Список курса |
| GET | `/api/course/items/{id}` | Элемент курса |
| GET | `/api/course-tests/{id}/data` | Данные теста курса |
| GET | `/api/course-items/{item}/words` | Слова урока |
| GET | `/api/course-items/{item}/grammar` | Грамматика урока |
| GET | `/api/library/items` | Каталог библиотеки |
| GET | `/api/library/items/{id}` | Книга |
| GET | `/api/library/items/{id}/file` | PDF-файл |
| GET | `/api/alphabet` | Алфавит |

### Аутентификация

| Метод | Путь | Назначение |
|---|---|---|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/refresh` | Обновить access-токен по cookie |
| POST | `/api/auth/forgot-password` | Запросить сброс пароля |
| POST | `/api/auth/reset-password` | Установить новый пароль |
| POST | `/api/auth/logout` | Выйти |
| POST | `/api/auth/logout-all` | Выйти на всех устройствах |
| GET | `/api/auth/me` | Текущий пользователь |
| PATCH | `/api/auth/profile` | Никнейм/email |
| PATCH | `/api/auth/settings` | Цель/часовой пояс |
| PATCH | `/api/auth/password` | Смена пароля |
| POST | `/api/auth/timezone` | Обновить timezone |

### Учебный контент

| Метод | Путь | Назначение |
|---|---|---|
| GET | `/api/dictionary` | Словарь |
| GET | `/api/topics` | Темы |
| GET | `/api/phrases` | Фразы |
| GET | `/api/grammar-rules` | Грамматика |
| GET | `/api/grammar-rules/filters` | Фильтры грамматики |
| GET | `/api/grammar-rules/{id}` | Правило |
| GET | `/api/daily-word` | Слово дня |
| GET | `/api/daily-quiz` | Квиз по слову дня |
| GET | `/api/daily-phrase` | Фраза дня |
| GET | `/api/daily-phrase-quiz` | Квиз по фразе дня |
| POST | `/api/user-words/start` | Добавить слово в SRS |
| POST | `/api/user-words/progress` | Оценка слова |
| DELETE | `/api/user-words/{id}` | Удалить слово |
| POST | `/api/user-phrases/start` | Добавить фразу в SRS |
| POST | `/api/user-phrases/progress` | Оценка фразы |
| DELETE | `/api/user-phrases/{id}` | Удалить фразу |
| GET | `/api/user/grammar-rules` | SRS грамматики |
| POST | `/api/user/grammar-rules/{id}/start` | Начать правило |
| POST | `/api/user/grammar-rules/{id}/review` | Повторить правило |
| DELETE | `/api/user/grammar-rules/{id}/reset` | Сбросить правило |

### Курс

| Метод | Путь | Назначение |
|---|---|---|
| GET | `/api/course/progress` | Серверный прогресс курса |
| POST | `/api/course/items/{courseItem}/progress` | Сохранить часть прогресса |

### Мини-игры

Все маршруты под `/api/minigames`; награда — `POST /api/minigames/reward`.

### Магазин

| Метод | Путь |
|---|---|
| GET | `/api/shop/items` |
| GET | `/api/shop/inventory` |
| POST | `/api/shop/items/{id}/buy` |
| POST | `/api/shop/items/{id}/equip` |
| POST | `/api/shop/items/{id}/unequip` |
| POST | `/api/shop/items/{id}/activate` |

### Достижения

| Метод | Путь |
|---|---|
| GET | `/api/achievements` |
| POST | `/api/achievements/sync` |

### Админка

Все маршруты требуют роль `admin`.

| Метод | Путь | Назначение |
|---|---|---|
| GET | `/api/admin/stats` | Сводка |
| GET | `/api/admin/users` | Пользователи |
| PATCH | `/api/admin/users/{user}` | Роль |
| POST | `/api/admin/users/{user}/reset-progress` | Сброс прогресса |
| GET/POST | `/api/admin/grammar-rules` | Список/создание правил |
| PATCH/DELETE | `/api/admin/grammar-rules/{rule}` | Изменение/удаление |
| GET/POST | `/api/admin/library-items` | Список/создание материалов |
| PATCH/DELETE | `/api/admin/library-items/{item}` | Изменение/удаление |
| GET/POST | `/api/admin/tips` | Список/создание советов |
| PATCH/DELETE | `/api/admin/tips/{tip}` | Изменение/удаление |
| GET | `/api/admin/course-items` | Элементы курса |
| PATCH | `/api/admin/course-items/{item}` | Название/порядок/уровень |
| GET | `/api/admin/achievements` | Достижения |
| GET | `/api/admin/logs` | Последние строки лога |

## Курс: прогресс и награды

Прогресс хранится в двух местах:

- `localStorage` — мгновенный UI, работает для гостя и при недоступном API;
- `user_course_progress` — серверное состояние для авторизованного
  пользователя.

При входе клиент загружает серверный прогресс и объединяет его с локальным по
максимуму. После прохождения части урока/теста клиент отправляет прогресс на
сервер.

Награды:

- урок, итоговый процент ≥ 70: черника 3 → 2 → 1 (не более 3 наград);
- тест, процент ≥ 70: клубника 3 → 2 → 1 (не более 3 наград);
- повторные успешные прохождения дают следующую ступень.

Сервер хранит прогресс и не даёт начислить награду больше трёх раз на
элемент. При этом **правильность ответов** по-прежнему вычисляется на клиенте,
поэтому процент можно подделать; это ограничение отмечено в AUDIT.

## SRS, серия и уровень

### SRS

Шаги: `0 → 1 → 3 → 7 → 30` дней. После трёх правильных ответов подряд
интервал растёт. `is_learned` — `interval_days >= 30`.

### Серия

- считается по часовому поясу пользователя;
- заморозки автоматически закрывают пропущенные дни;
- рекорд и текущая серия в профиле/баннере;
- милстоуны `7, 10, 30, 50, 75, 100, 125, 150, 175, 200, 250, 300, 365, 500`;
- подарок по умолчанию — 1 заморозка.

### Уровень языка

Эвристика CEFR-подобной шкалы в `utils/languageLevel.ts`:

- слова;
- фразы ×2;
- грамматика ×4;
- уроки ×12;
- тесты ×18;
- средний процент тестов.

Шкала `A1 → A2 → B1 → B2 → C1 → C2`. Это мотивационная эвристика, а не
официальный экзамен.

## Достижения и уведомления

- 7 категорий, включая секретные;
- награды в чернике;
- превью 6 достижений в профиле, полная страница `/achievements`;
- полосы достижений на основных страницах;
- достижения синхронизируются через `/api/achievements/sync`.

Уведомления:

- in-app история в `localStorage` пользователя;
- toast и бейдж непрочитанных;
- достижения, серия, дневная цель;
- настройки в профиле;
- браузерные уведомления — только с разрешения и в защищённом контексте.

## Разборы

Сейчас это demo-раздел:

- данные лежат в `frontend-web/src/pages/BreakdownsPage/breakdownData.ts`;
- прогресс и фразы — в `localStorage`;
- видео — внешний демо-ролик;
- для реального продукта нужна медиамодель и API.

## Frontend

- React Router с lazy-страницами и `Suspense`;
- `ProtectedRoute`/`GuestOnlyRoute`;
- контексты `Auth`, `Theme`, `Achievements`, `Notifications`;
- SCSS с токенами и `data-theme`;
- адаптив: sidebar → mobile bottom nav + sheet;
- озвучка через единый `lib/speech.ts`, скорости 0.5/1;
- PDF через `react-pdf`;
- ошибки страниц, пустые состояния, 404, ErrorBoundary.

Кэш/состояние:

- курс/разборы/библиотека — `localStorage`;
- SRS, магазин, достижения, серия — сервер;
- тема — `localStorage`.

## Проверки

```bash
cd frontend-web
npm run lint
npm run build
npm audit
```

```bash
cd backend
docker compose exec laravel.test php artisan test
docker compose exec laravel.test php artisan migrate:status
```

Текущий статус:

- lint/build — OK;
- npm audit — 0;
- backend tests — 2 smoke;
- маршруты и API проверены вручную; тест курса исправлен;
- подробный аудит — [AUDIT.md](AUDIT.md).

## Ограничения и планы

1. Серверная проверка правильности ответов курса (сейчас процент с клиента).
2. CSP, HTTPS и продакшен-CORS.
3. Гостевая сессия с TTL 7 дней и merge при регистрации.
4. Реальные данные разборов и видео вместо демо.
5. Расширенная админка: уроки/тесты, слова/фразы, видео, разборы, загрузка файлов и блокировки пользователей.
6. Автотесты бизнес-логики.
7. Профильная аналитика: время, графики, экспорт/удаление аккаунта.
8. PWA/офлайн и push-уведомления.

## Если что-то не запускается

### API 500/не подключается

```bash
docker compose ps
docker compose logs laravel.test --tail=100
docker compose exec laravel.test php artisan optimize:clear
```

Проверьте `DB_HOST=mysql`, `APP_KEY`, выполнение миграций.

### Ошибка `could not find driver` на хосте

PHP на Windows/WSL без `pdo_mysql`. Не запускайте `php artisan` на хосте —
только через `docker compose exec laravel.test`.

### Ошибка 401 после входа

Проверьте:
- `localStorage.hanibo_token`;
- cookie `hanibo_refresh` в DevTools → Application → Cookies;
- `FRONTEND_URL` и настройки cookie/HTTPS;
- что запросы идут через `/api` и Vite-прокси.

### Сброс пароля не приходит на почту

По умолчанию `MAIL_MAILER=log`; письмо пишется в
`backend/storage/logs/laravel.log`. Для реальной отправки настройте SMTP.

## Передача проекта

Код и история лежат в Git-репозитории. Локальная папка проекта:

```text
/home/bhhhh/projects/hanibo          # внутри WSL
\\wsl.localhost\Ubuntu\home\bhhhh\projects\hanibo  # из Windows
```

Git remote:

```text
git@github.com:hihihaha-143/hanibo.git
https://github.com/hihihaha-143/hanibo
```

Перед передачей другому человеку:

1. Не передавайте свой `backend/.env` с реальными паролями и ключами.
2. Получатель копирует `backend/.env.example` в `.env` и задаёт `APP_KEY`,
   `DB_*`, `FRONTEND_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
3. В `frontend-web/vite.config.ts` нужно заменить proxy target на адрес его
   backend.
4. Выполнить `composer install`/`npm ci`, миграции, сидеры и
   `AdminUserSeeder`.
5. Проверить, что `backend/storage` и загруженные PDF/обложки переданы
   отдельно, если они не входят в Git.

## Git

```bash
git status
git add -A
git commit -m "feat: ..."
```

Перед коммитом проверяйте `npm run lint`, `npm run build` и миграции.
