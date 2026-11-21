import { useState } from "react";
import { Bell, CheckCheck, X } from "lucide-react";
import { useNotifications } from "../../context/useNotifications";

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead, clearAll } =
    useNotifications();
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((value) => {
      const next = !value;
      if (next) markAllRead();
      return next;
    });
  };

  return (
    <div className="notification-bell">
      <button
        type="button"
        className="notification-bell__trigger"
        onClick={toggle}
        aria-label={`Уведомления${unreadCount ? `, новых: ${unreadCount}` : ""}`}
        aria-expanded={open}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="notification-bell__badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-bell__panel">
          <div className="notification-bell__head">
            <strong>Уведомления</strong>
            <button
              type="button"
              className="notification-bell__close"
              onClick={() => setOpen(false)}
              aria-label="Закрыть уведомления"
            >
              <X size={16} />
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="notification-bell__empty">
              Пока тихо. Здесь появятся достижения, серия и цель дня.
            </p>
          ) : (
            <div className="notification-bell__list">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={
                    "notification-bell__item" +
                    (item.read ? "" : " notification-bell__item--unread")
                  }
                >
                  <span className="notification-bell__item-title">
                    {item.title}
                  </span>
                  <span className="notification-bell__item-text">
                    {item.text}
                  </span>
                  <small>
                    {new Date(item.createdAt).toLocaleString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
              ))}
            </div>
          )}

          <div className="notification-bell__actions">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={markAllRead}
              disabled={notifications.length === 0}
            >
              <CheckCheck size={14} />
              Прочитано
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              Очистить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
