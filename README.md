# hanibo

Учебный сайт для изучения корейского языка: курс с уроками и тестами,
словарь, грамматика, фразы, алфавит, мини-игры, библиотека PDF-материалов,
магазин косметики и стрик с ежедневной целью.

Проект состоит из двух частей:

- `frontend-web/` — SPA на React + TypeScript + Vite;
- `backend/` — REST API на Laravel + MySQL, запускается через Laravel Sail
  (Docker).

Подробный аудит кода, безопасности и компонентов — в [AUDIT.md](AUDIT.md).

## Содержание

- [Возможности](#возможности)
- [Стек](#стек)
- [Структура](#структура)
- [Быстрый старт](#быстрый-старт)
- [Настройка окружения](#настройка-окружения)
- [API](#api)
- [Как устроен фронтенд](#как-устроен-фронтенд)
- [Дизайн-система](#дизайн-система)
- [Прогресс, SRS и стрик](#прогресс-srs-и-стрик)
- [Озвучка](#озвучка)
- [Проверки и тесты](#проверки-и-тесты)
- [Безопасность](#безопасность)
- [Что ещё не сделано](#что-ещё-не-сделано)
- [Git](#git)
- [Если что-то не запускается](#если-что-то-не-запускается)

## Возможности

### Курс

- вкладки страницы: **Курс**, **Тренировки**, **Мой словарь**, **Статистика**;
- список уроков, дополнительные материалы и тесты;
- уроки открываются последовательно; прогресс хранится в `localStorage`;
- вкладки урока: слова, грамматика, фразы, тест;
- итоговый тест с разными типами вопросов: выбор, true/false, ввод текста,
  пропуски, порядок слов, пары, аудио, правописание, флешкарты;
- результат и повторное прохождение;
- **Тренировки** — вкладка с двумя персональными модулями:
  - **Повторение** — задания по последним пройденным урокам;
  - **Работа над ошибками** — задания по словам и грамматике, где были ошибки;
- **Мой словарь** — слова, фразы и грамматика в процессе изучения;
- **Статистика** — прогресс курса, серия и рассчитанный уровень языка.

### Практика

- **Алфавит**: согласные, гласные, дифтонги, ассимиляция, карточки букв,
  пропись, тесты по группам;
- **Словарь**: поиск, фильтры по теме и статусу, SRS, «слово дня»,
  ежедневная тренировка;
- **Грамматика**: правила, фильтры, модалка с примерами, SRS;
- **Фразы**: поиск, темы, SRS, «фраза дня»;
- **Разбор** — пока заглушка (незавершённый раздел);
- мини-игры для слов и фраз: true/false, аудио, пары, слоги, скорость,
  правописание, ввод, порядок;
- ежедневные квизы и серии правильных ответов.

### Библиотека

- каталог книг и материалов с обложками;
- поиск и фильтры: уровень, язык, год, сортировка;
- продолжение чтения и недавно открытые;
- PDF-вьюер: страницы, миниатюры, оглавление, масштаб, 1/2 страницы,
  запоминание последней страницы.

### Аккаунт и геймификация

- регистрация и вход через Laravel Sanctum;
- статистика в баннере: клубника, черника, изучаемые/изученные,
  серия дней;
- стрик: ежедневная цель по опыту, заморозки, рекорд, неделя;
- блок стрейка на главной: текущая серия, неделя, прогресс цели,
  ближайший подарок;
- милстоуны серии: `7, 10, 30, 50, 75, 100, 125, 150, 175, 200, 250, 300,
  365, 500` дней; по умолчанию подарок — 1 заморозка;
- магазин: косметика (аватары, рамки, баннеры, статусы, медали, никнеймы,
  иконки), бустеры опыта и заморозки;
- достижения и уведомления о разблокировке.

### Общее

- светлая и тёмная темы;
- адаптив от мобильных до широких экранов;
- озвучка корейских слов и фраз в двух темпах: `0.5` и `1`;
- состояния загрузки, ошибки, пустые состояния, 404 и ErrorBoundary.

## Стек

### Frontend

| Технология | Версия |
| --- | --- |
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| SCSS (`sass-embedded`) | 1.105 |
| React Router | 7 |
| Framer Motion | 14 |
| Axios | 1.20 |
| React PDF | 11 |
| React Markdown + remark-gfm | 10 / 4 |
| react-hotkeys-hook | 5 |
| lucide-react | 1.48 |
| hangul-writer | 1.0 |
| canvas-confetti | 1.9 |

Шрифты: `@fontsource/noto-sans-kr` и Google Fonts `Nunito`.

### Backend

- PHP `^8.3` (Sail-образ 8.5);
- Laravel `^13.17`;
- Laravel Sanctum;
- MySQL 8.4;
- Redis (в compose);
- Laravel Sail / Docker Compose;
- PHPUnit, Pint, Tinker.

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
│   │   ├── api/            # запросы к Laravel API
│   │   ├── assets/         # картинки, магазин
│   │   ├── components/     # общие React-компоненты
│   │   ├── config/         # API_BASE_URL
│   │   ├── context/        # Auth, Theme
│   │   ├── layouts/        # MainLayout, Sidebar, Banner, MobileNav
│   │   ├── lib/            # speech, PDF, motion, recent, milestones
│   │   ├── pages/          # страницы и блоки страниц
│   │   ├── styles/         # SCSS по тем же блокам, что и pages
│   │   ├── types/          # доменные типы
│   │   └── utils/          # SRS/тесты/прогресс курса
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── backend/
    ├── app/
    │   ├── Http/Controllers/   # API и Shop
    │   ├── Models/             # User, Word, Phrase, Grammar, Library, Shop
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
- Docker + Docker Compose;
- Composer (для установки backend-зависимостей);
- WSL2 на Windows — рекомендуется, но не обязателен.

### 1. Backend

```bash
cd backend

# если .env ещё нет
cp .env.example .env
# затем замени DB_* на MySQL-блок из раздела «Настройка окружения»

# зависимости PHP
composer install

# поднять Sail: laravel.test, MySQL 8.4, Redis
docker compose up -d --build

# ключ приложения (если APP_KEY пустой)
docker compose exec laravel.test php artisan key:generate

# схема БД
docker compose exec laravel.test php artisan migrate

# базовые данные: словарь, курс, уроки
docker compose exec laravel.test php artisan db:seed

# публичные ссылки на storage (если используются файлы библиотеки)
docker compose exec laravel.test php artisan storage:link

# очистить кэш после изменений
docker compose exec laravel.test php artisan optimize:clear
```

API будет доступен на `http://localhost/api` (порт 80 контейнера
`laravel.test`).

> **Важно:** `php artisan` нужно запускать **в контейнере**
> (`docker compose exec laravel.test ...`). PHP на хосте может быть без
> `pdo_mysql`, а `DB_HOST=mysql` резолвится только внутри Docker-сети.

Для полного демо-набора данных можно выполнить дополнительные сидеры:

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

Если сидеры уже применялись, повторный запуск может создать дубли — лучше
запускать их на чистой БД.

### 2. Frontend

```bash
cd frontend-web
npm ci
npm run dev
```

Vite выведет Local и Network-адреса. Открой **Network-адрес**, например:

```text
http://<WSL-IP>:5173/
```

Если `5173` занят, Vite выберет `5174`, `5175` и т.д. — ориентируйся на
вывод команды.

### 3. Связь фронта с бэкендом

В `frontend-web/vite.config.ts` API проксируется на:

```ts
target: "http://192.168.0.15"
```

Этот адрес нужно заменить на адрес твоего backend:

- backend в Docker на этой же машине: `http://127.0.0.1`;
- backend на другой машине: `http://<IP>:<PORT>`.

После изменения `vite.config.ts` перезапусти `npm run dev`.

## Настройка окружения

### Backend `.env`

Файл `backend/.env` не коммитится. Для Docker/MySQL основные значения:

```env
APP_NAME=hanibo
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=hanibo
DB_USERNAME=sail
DB_PASSWORD=password

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

`DB_HOST=mysql` — имя сервиса из `compose.yaml`, а не `localhost`.
Если используешь `.env.example` с SQLite, для Sail замени блок `DB_*` на
MySQL-вариант выше.

Для запуска Sail без предупреждения `WWWUSER` можно добавить:

```env
WWWUSER=1000
WWWGROUP=1000
```

### Frontend

Отдельного `.env` нет. API всегда идёт через относительный `/api`, а
прокси настраивается в `vite.config.ts`.

## API

Все ответы — JSON. Авторизация — Bearer-токен Sanctum:

```http
Authorization: Bearer <token>
```

### Публичные

| Метод | Путь | Назначение |
| --- | --- | --- |
| GET | `/api/ping` | Проверка API |
| GET | `/api/tips/random` | Случайный совет |
| GET | `/api/course/items` | Список курса |
| GET | `/api/course/items/{id}` | Элемент курса |
| GET | `/api/course-tests/{id}/data` | Данные теста |
| GET | `/api/course-items/{item}/words` | Слова урока |
| GET | `/api/course-items/{item}/grammar` | Грамматика урока |
| GET | `/api/library/items` | Каталог библиотеки |
| GET | `/api/library/items/{id}` | Книга |
| GET | `/api/library/items/{id}/file` | PDF-файл |
| GET | `/api/alphabet` | Алфавит |

### Авторизация

| Метод | Путь |
| --- | --- |
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| POST | `/api/auth/logout` |
| GET | `/api/auth/me` |
| POST | `/api/auth/timezone` |

### Защищённые

- `/api/dictionary`, `/api/topics`, `/api/phrases`;
- `/api/daily-word`, `/api/daily-quiz`, `/api/daily-phrase`,
  `/api/daily-phrase-quiz`;
- `/api/user-words/*`, `/api/user-phrases/*`;
- `/api/grammar-rules/*`, `/api/user/grammar-rules/*`;
- `/api/minigames/*` (слова и фразы);
- `/api/alphabet/{letter}/progress`, `/api/alphabet/group/progress`;
- `/api/shop/items`, `/api/shop/items/{id}/buy|equip|unequip|activate`,
  `/api/shop/inventory`.

Покупки, начисление валюты и прогресс SRS валидируются на сервере.
Прогресс **курса** (какие уроки пройдены) пока хранится на клиенте в
`localStorage` и не является защищённой границей.

## Как устроен фронтенд

### Роутинг

`src/App.tsx`:

- `/` — главная;
- `/course`, `/course/item/:id` — курс и урок;
- `/alphabet`, `/alphabet/test/:category` — алфавит;
- `/library`, `/library/:id` — библиотека и PDF;
- `/practice` — практика с вкладками (алфавит, словарь, грамматика, фразы,
  «Разбор»);
- `/shop` — магазин;
- `/login`, `/register` — авторизация;
- `*` — 404.

Защищённые маршруты обёрнуты в `ProtectedRoute`, гостевые — в
`GuestOnlyRoute`. Lazy-страницы находятся внутри `Suspense` с общим
загрузчиком, ошибки рендера ловит `ErrorBoundary`.

### Состояние

- `AuthProvider` — пользователь, токен, `refreshUser`, `logout`;
- `ThemeProvider` — светлая/тёмная тема, `data-theme` на `<html>`;
- локальные состояния страниц;
- без Redux/MobX.

Axios-клиент (`src/api/client.ts`):

- добавляет `Authorization`;
- при `401` очищает токен и разлогинивает через событие
  `hanibo:auth-expired`;
- таймаут 10 секунд.

### Стили

SCSS повторяет структуру компонентов:

```text
src/styles/
├── abstracts/    # токены, миксины, брейкпоинты
├── base/         # reset, базовая типографика, скроллбар
├── components/   # Button, Field, Card, Page, Modal, StateBlock, ...
├── layouts/      # Banner, Sidebar, MobileNav, MainLayout
└── pages/        # стили страниц и их блоков
```

Правила:

- BEM-подобные классы;
- один блок — отдельный партиал;
- страница и её стили лежат в папках с одинаковыми именами;
- общие кнопки/поля/карточки не дублируются по страницам;
- стили подключаются через `_index.scss` и `@forward`/`@use`.

## Дизайн-система

Токены — `src/styles/abstracts/_variables.scss`:

- палитра, поверхности, границы, `success`/`error`;
- радиусы, тени, backdrop, focus;
- z-index: banner, sidebar, sheet, modal, toast;
- layout: `--content-max`, `--reading-max`, `--banner-height`,
  `--mobile-nav-height`, `--sidebar-width`.

Основные компоненты:

| Компонент | Класс/назначение |
| --- | --- |
| Button | `.btn` + primary/accent/secondary/outline/ghost/danger/success/icon/active |
| Field | `.input`, `.select`, `.field`, `.input-wrap` |
| Card | `.card` |
| Page | `.page`, заголовок, reading-ширина |
| Modal | `.modal`, `.modal__panel`, `.modal__close` |
| StateBlock | загрузка/ошибка/пусто + retry |
| ChipsBlock | горизонтальные вкладки |
| SpeakControls | озвучка 0.5/1 |
| BackLink | ссылка «Назад» |
| Tooltip | подсказки |
| ProgressBar | прогресс |

Адаптив:

- брейкпоинты `sm 576`, `md 768`, `lg 992`, `xl 1200`;
- мобильная навигация и safe-area;
- контент до `1440px`, главная — `1360px`;
- `overflow-x: clip` вместо `hidden`, чтобы работал `position: sticky`;
- кастомный скроллбар;
- touch-таргеты и `prefers-reduced-motion`.

## Прогресс, SRS и стрик

### SRS слов и фраз

Шаги интервалов: `0 → 1 → 3 → 7 → 30` дней. После трёх правильных ответов
подряд интервал увеличивается. Финальный шаг — `30` дней.

- `is_learned` — `interval_days >= 30`;
- `words_learning` / `phrases_learning` — `< 30`;
- `words_learned` / `phrases_learned` — `>= 30`;
- «В процессе» и «Изучено» используют ту же семантику.

### Ежедневная цель и стрик

- день считается по таймзоне пользователя;
- цель по опыту (`daily_exp_goal`) закрывает день;
- заморозка автоматически тратится за пропущенные дни;
- если заморозок не хватает — серия сбрасывается;
- `streak_current`, `streak_best`, `streak_last_date`,
  `streak_frozen_today`, `streak_freezes`;
- `streak_rewards_claimed` — старые награды каждые 5 дней (клубника/черника);
- `streak_milestone_claimed` — новые милстоуны;
- подарок за милстоун по умолчанию — **1 заморозка**;
- список милстоунов: `7, 10, 30, 50, 75, 100, 125, 150, 175, 200, 250, 300,
  365, 500`;
- блок стрейка отображается на главной в правой колонке.

Миграция для милстоунов:

```bash
docker compose exec laravel.test php artisan migrate
```

### Бустеры

- `buff_exp_x2_1h` — удваивает опыт на час (сервер:
  `StreakService::addExp`);
- `buff_streak_freeze` — добавляет заморозку;
- бейдж `ExpBoostBadge` показывает остаток времени.

Сейчас опыт через `StreakService` начисляет только алфавит; тесты курса и
мини-игры опыта не дают — это незавершённая часть наград, а не ошибка
бустера.

### Прогресс курса

Проценты слов/грамматики/итогового теста курса хранятся в
`localStorage` (`hanibo:progress`). Это клиентский прогресс для
разблокировки уроков; он не заменяет серверную валидацию наград.

### Уровень языка

Уровень рассчитывается на клиенте в `utils/languageLevel.ts` и показывает
CEFR-подобную шкалу `A1 → A2 → B1 → B2 → C1 → C2`:

- изученные слова + фразы ×2 + грамматика ×4;
- пройденные уроки ×12 и тесты ×18;
- средний процент тестов.

Это эвристика для мотивации, а не официальный экзамен. В «Статистике»
показывается текущий уровень, шкала до следующего и вклад в уровень по
словам/фразам/грамматике/курсу.

### Повторение и ошибки

- «Повторение» собирает слова и грамматику из последних 4 уроков, где есть
  прогресс (`partial` или `complete`), и генерирует обычный тест.
- «Работа над ошибками» берёт слова и грамматику с `mistakes_count > 0`
  из SRS и фильтрует по ним контент пройденных уроков.
- Ошибки по фразам пока не включены в этот тренажёр; они видны в «Моём
  словаре» и в SRS.

## Озвучка

- `src/lib/speech.ts` — единая точка `speakKorean`;
- выбирает установленный корейский голос (`ko-KR`), если он есть;
- отменяет предыдущую фразу;
- `rate` ограничен `0.5–2`;
- учитывает баг Chrome с `cancel()` + `speak()`;
- `SpeakControls` даёт кнопки `0.5` и `1`;
- если `speechSynthesis` недоступен, кнопки disabled.

Озвучка есть в карточках слов/фраз/грамматики, ежедневных блоках,
уроках, тестах, алфавите и примерах модалки грамматики. В плитках
некоторых мини-игр отдельной кнопки нет — это известное ограничение.

## Проверки и тесты

### Frontend

```bash
cd frontend-web
npm run lint
npm run build
npm audit
```

- `lint` — ESLint;
- `build` — `tsc -b` + Vite;
- `npm audit` — 0 известных уязвимостей на момент проверки.

### Backend

```bash
docker compose exec laravel.test php artisan test
docker compose exec laravel.test ./vendor/bin/pint --test
```

Тестов в проекте пока мало (базовые Laravel-тесты), но команды настроены.

### Ручная проверка

Проверялись:

- desktop `1440×1000` и `1920×1080`;
- mobile `390×844`;
- светлая и тёмная темы;
- главная, курс, алфавит, практика, библиотека/PDF, магазин, авторизация;
- ошибки API, пустые состояния, 404, PDF-рендер.

## Безопасность

- `backend/.env` не коммитится; секреты не должны попадать в Git.
- Дамп `hanibo.sql` больше не отслеживается (`*.sql` в `.gitignore`), но
  **старая версия осталась в истории Git**. Если репозиторий публичный:
  сменить пароль пользователя из дампа и вычистить файл из истории
  (`git filter-repo`/BFG + force-push).
- JWT/Sanctum-токен хранится в `localStorage` — при XSS его можно украсть.
  Для продакшена лучше httpOnly-cookie + CSP.
- `vite.config.ts` слушает `0.0.0.0` (нужно для доступа из Windows к WSL).
  Не открывай dev-сервер в недоверенной сети.
- `dangerouslySetInnerHTML` в проекте нет; markdown рендерится без raw HTML.
- Покупки, валюта и SRS-прогресс валидируются на бэкенде.
- Прогресс курса в `localStorage` можно подделать; не используй его как
  доказательство оплаты/доступа.

## Что ещё не сделано

Это **не ошибки**, а незавершённые разделы:

- «Разбор» — заглушка;
- профиль/страница аккаунта — отсутствует, блок стрейка пока на главной;
- часть курса;
- вид списка библиотеки (тип и измерение полок есть, переключателя в UI нет);
- отдельная озвучка плиток во всех мини-играх;
- фразовые ошибки в «Работе над ошибками» (сейчас только слова и грамматика);
- полноценный focus-trap во всех модалках;
- CSP и httpOnly-cookie для токена.

## Git

Текущая ветка: `style/cleanup`.

Ключевые коммиты:

- `e1a320f` — рефакторинг стилей и общих компонентов;
- `f99a935` — исправление sticky-скролла;
- `39ea7bd` — аудит: озвучка, auth, мини-игры, состояния;
- `3fa3bcf` — озвучка карточек, клавиатура «Найди пару», SRS-счётчики;
- `523106c` — блок стрейка и милстоуны;
- `10a37c5`, `2b3e6c7` — ошибки магазина и документация.

Перед коммитом:

```bash
git diff --check
git status
```

## Если что-то не запускается

### `could not find driver` при `php artisan migrate`

Ты запускаешь artisan на хосте, где нет `pdo_mysql`. Проект использует
Sail/Docker:

```bash
cd backend
docker compose exec laravel.test php artisan migrate
```

### `localhost` в браузере не открывается, хотя Vite запущен

В WSL проброс `localhost` иногда зависает. Vite слушает `0.0.0.0`, поэтому
используй Network-адрес из вывода `npm run dev`:

```text
http://<WSL-IP>:5173/
```

IP можно узнать через `hostname -I`.

### `Port 5173 is in use`

Vite выберет следующий порт (`5174`, `5175`). Смотри его в выводе и открывай
Network-адрес именно с этим портом.

### Предупреждение `WWWUSER is not set`

Безобидное предупреждение Docker Compose. Можно добавить в `backend/.env`:

```env
WWWUSER=1000
WWWGROUP=1000
```

### 404 на `grammarMiniGames.tsx`

Раньше файл с JSX был `.ts`; сейчас это `.tsx`. После переименования
перезапусти Vite.

### PDF не отображается

Проверь:

- `backend/storage` доступен и `php artisan storage:link` выполнен;
- файл существует по `file_path`;
- `public/pdfjs/` не удалён;
- API `/api/library/items/{id}/file` отвечает 200.
