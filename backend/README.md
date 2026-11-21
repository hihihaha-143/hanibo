# backend

REST API hanibo на Laravel 13 + Sanctum + MySQL. Запускается через Laravel Sail.

Полная документация проекта — в [../README.md](../README.md).

## Быстрый запуск

```bash
cd backend
composer install
cp .env.example .env   # затем настройте MySQL-блок из ../README.md
docker compose up -d --build
docker compose exec laravel.test php artisan key:generate
docker compose exec laravel.test php artisan migrate --seed
docker compose exec laravel.test php artisan storage:link
```

API: `http://localhost/api`.

## Важно

`php artisan` запускайте только в контейнере:

```bash
docker compose exec laravel.test php artisan <command>
```

На хосте PHP может быть без `pdo_mysql`, а `DB_HOST=mysql` доступен только
внутри Docker-сети.

## Проверки

```bash
docker compose exec laravel.test php artisan test
docker compose exec laravel.test ./vendor/bin/pint --test
```

## Основные каталоги

- `app/Http/Controllers/Api` — публичный API и SRS;
- `app/Http/Controllers/Shop` — магазин и активация бустеров;
- `app/Services/Streak` — стрик, заморозки, опыт, милстоуны;
- `app/Services/Achievement` — достижения алфавита;
- `database/migrations` — схема;
- `database/seeders` — словарь, курс, грамматика, алфавит, магазин, советы;
- `routes/api.php` — маршруты API.
