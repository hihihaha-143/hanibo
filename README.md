# hanibo

Сайт для изучения корейского языка: курс, уроки, словарь, грамматика, фразы,
алфавит, тесты и мини-игры, библиотека PDF-материалов и магазин косметики.

Стек фронтенда: React 19, TypeScript, Vite, SCSS, framer-motion,
react-router-dom. Бэкенд — Laravel/PHP.

## Запуск

```bash
cd frontend-web
npm ci
npm run dev
```

Проверки:

```bash
npm run lint
npm run build
```

В `vite.config.ts` API проксируется на `http://192.168.0.15` (см. `server.proxy`).

При запуске в WSL браузер на Windows иногда не открывает `localhost`
(соединение есть, ответа нет). Vite слушает `0.0.0.0`, поэтому используй
Network-адрес из вывода `npm run dev` — например
`http://<WSL-IP>:5174/`.

## Что изменилось

### 1. Единая дизайн-система

`styles/abstracts/_variables.scss` переведён на общие токены:

- палитра, поверхности, границы, семантика (`success`, `error`), прогресс;
- радиусы, тени, focus, backdrop;
- z-index-слои (`--z-banner`, `--z-sidebar`, `--z-sheet`, `--z-modal` и т.д.);
- layout-токены: `--content-max`, `--reading-max`, `--banner-height`,
  `--mobile-nav-height`, `--sidebar-width`;
- акцент затемнён до `#1D4ED8` — белый текст на кнопках и синий текст на
  кремовом фоне проходят WCAG AA;
- `success`/`error` затемнены для светлого фона;
- в тёмной теме `--color-secondary` затемнён до `#5B6190` — кремовый текст на
  лавандовых блоках стал читаемым.

`_reset.scss` получил глобальное `:focus-visible`, `100dvh`, нормальные
`min-width: 0` для полей и уважение `prefers-reduced-motion`.
`_typography.scss` — адаптивные заголовки через `clamp()` и `text-wrap: balance`.

### 2. Общие UI-компоненты

В `styles/components/` вынесены повторяющиеся паттерны:

| Компонент | Назначение |
| --- | --- |
| `Button` | `.btn` + primary/accent/secondary/outline/ghost/danger/success/icon/active, sm/lg/block |
| `Field` | `.input`, `.select`, `.field`, `.input-wrap`, `.password-toggle` |
| `Card` | единая поверхность карточки |
| `Page` | каркас страницы, заголовок, reading-ширина |
| `Actions` | группы кнопок |
| `BackLink` | ссылка «Назад» с иконкой |
| `Tooltip` | подсказки статистики и токенов |
| `SpeakButton` | кнопки озвучки 0.5 / 1 |
| `Chip` | фильтры-чипы |
| `Tabs` | вкладки |
| `TextInput` | «поле + кнопка ответа» |
| `Modal` | общая модалка с focus и мобильным размером |
| `ChipsBlock` | горизонтальный скролл-контейнер вкладок |
| `ProgressBar` | общий прогресс |
| `StateBlock` | загрузка/ошибка/пусто + spinner и кнопка повтора |

Добавлены React-компоненты:

- `components/BackLink/BackLink.tsx`;
- `components/SpeakButton/SpeakControls.tsx` + `lib/speech.ts` — единая
  озвучка вместо копий `speechSynthesis` в разных блоках;
- `components/StateBlock` — `role`, `aria-live`, `aria-busy`, spinner.

### 3. Общие страницы и блоки

- `HomePage`, `CoursePage`, `ItemPage`, `LessonView`, все типы тестов и
  `Library` приведены к общим `page`, `card`, `btn`, `actions`.
- `AuthPage`: Login/Register вынесены в `pages/AuthPage/`, общая карточка и поля
  через `AuthPage` + `AuthField`; удалён старый `_auth-shared.scss`.
- `CourseItemBlock`: подписи на сенсорных экранах и клавиатуре, `aria-label`
  со статусом, аккуратное свечение complete без перекрытия соседей.
- `ItemPage`: самодельные состояния заменены `StateBlock`, добавлена ссылка
  назад; `FinalTestTab` удалён — используется `Test` напрямую.
- `LessonView`: вкладки через общий `.tabs`, загрузка через `StateBlock`.
- `PhraseToken`: подсказка через общий `.tooltip`, открывается по hover, фокусу
  и тапу, закрывается по Escape.
- `LibraryPage`: заголовок, общий toolbar (`.input`, `.select`, `.chip`, `.btn`),
  карточки с подписью на touch и прогрессом чтения.
- `LibraryViewerBlock`: кнопки управления переведены на `.btn--icon`,
  высота учитывает баннер и мобильную навигацию.
- `AlphabetPage`: заголовок и подзаголовок, вкладки слева, действия справа,
  загрузка/ошибка через `StateBlock`, мобильная раскладка.
- `PracticePage`: заголовок «Практика» и нормальный вертикальный ритм.
- `Dictionary/Grammar/Phrases`: toolbar-блоки унифицированы — поиск через
  `.input`, фильтры через `.select`, кнопки мини-игр через `.btn`.
- `ShopPage`/`ShopItemCard`: карточка использует `.card`, кнопки — `.btn`.
- `DictionaryCardBlock`/`GrammarCardBlock`/`PhrasesCardBlock`: общая `.card`.

### 4. Адаптив и доступность

- Сайдбар начинается под баннером, а не наезжает на него; высота считается от
  `--banner-height`.
- Контент ограничен `1200px`, снизу зарезервировано место под мобильную
  навигацию и `safe-area`.
- Мобильная навигация получила safe-area, touch-зоны и подпись «Тёмная тема».
- На сенсорных экранах и узких ширинах названия курса/карточек показываются
  без hover.
- Тестовые сетки: варианты — 1 колонка на телефоне, true/false — 2,
  syllable — 4 → 2, match — 2 колонки с уменьшенными отступами.
- Кнопки и поля получили focus-visible, `aria-label`, `aria-pressed`,
  `aria-expanded`, disabled-состояния.
- `StateBlock` сообщает о загрузке/ошибке через `role` и `aria-live`.
- Учтён `prefers-reduced-motion`.

### 5. Удалено/починено

- Исправлено расширение `GrammarPage/MiniGame/grammarMiniGames`: файл с JSX
  был `.ts`, из-за чего сборка падала, а dev-сервер отдавал 404 на
  `grammarMiniGames.tsx`. Теперь это `.tsx`.
- Удалён `ItemPage/LessonView/FinalTestTab.tsx` — пустая обёртка без стилей.
- Удалены старые стили `styles/pages/ItemPage/{Test,DictionaryTab,GrammarTab}`
  с PascalCase-файлами; дерево теперь повторяет компоненты:
  `styles/pages/ItemPage/LessonView/...`.
- Удалён `_auth-shared.scss` и неиспользуемый `_login-page.scss`.
- Удалены дубли `library-viewer-block__btn` (раньше классы были в TSX, но
  стилей не существовало) — теперь общий `.btn--icon`.
- Удалены старые стили `library-toolbar-block__chip/__select/__search`,
  `__view`, `__view-btn`; используются общие компоненты.
- Убраны неиспользуемые импорты и переменные в `MatchGame`, `PhraseMatchGame`,
  `MiniGamesModal`, `useShop`.
- Исправлены `any` и обработка ошибок в PDF-компонентах, зависимости хуков в
  `LibraryViewerBlock`, утечка ref в `LetterWritingBlock`.
- `MiniGamesModal`: константы и типы мини-игр вынесены в
  `DictionaryPage/MiniGame/miniGamesData.tsx`, чтобы Fast Refresh работал.

### 6. Проверка

- `npm run lint` — без ошибок и предупреждений.
- `npm run build` — успешно.
- Проверено в браузере: desktop 1440×1000, mobile 390×844, светлая тема,
  главная, курс, алфавит, практика (алфавит/словарь/грамматика/фразы),
  библиотека и PDF-вьюер.
- Осталось только предупреждение Vite о размере основного JS-чанка (>500 kB);
  оно не относится к стилям.

## Git

Работа ведётся в ветке `style/cleanup` (от `feature/streak`). Исходное
состояние ветки зафиксировано, изменения стилей — отдельным коммитом.
