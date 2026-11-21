import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page not-found-page">
      <p className="not-found-page__code">404</p>
      <h1 className="page__title">Страница не найдена</h1>
      <p className="not-found-page__text">
        Такого адреса нет. Возможно, ссылка устарела.
      </p>
      <Link className="btn btn--accent" to="/">
        На главную
      </Link>
    </div>
  );
}
