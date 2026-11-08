import { Snowflake, Zap, Check } from "lucide-react";
import type { ShopItem } from "../../types/shop";
import type { User } from "../../types/user";
import { resolveShopImage, getUserAvatarUrl } from "../../lib/shopImages";
import blueberryIcon from "../../assets/blueberry.png";
import strawberryIcon from "../../assets/strawberry.png";

interface ShopItemCardProps {
  item: ShopItem;
  user: User | null;
  pending: boolean;
  pendingType: "buy" | "equip" | "unequip" | "activate" | null;
  onBuy: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
  onUnequip: (item: ShopItem) => void;
  onActivate: (item: ShopItem) => void;
}

export function ShopItemCard({
  item,
  user,
  pending,
  pendingType,
  onBuy,
  onEquip,
  onUnequip,
  onActivate,
}: ShopItemCardProps) {
  const currencyIcon =
    item.currency === "strawberry" ? strawberryIcon : blueberryIcon;

  const balance =
    item.currency === "strawberry"
      ? (user?.strawberry ?? 0)
      : (user?.blueberry ?? 0);

  const canAfford = balance >= item.price;
  const isBuff = item.type === "buff";
  const isActive = item.active;
  const isOwned = item.owned;

  const nickname = user?.nickname ?? "Ник";
  const imageSrc = resolveShopImage(item.image);
  const userAvatarUrl = getUserAvatarUrl(user);

  const renderPreview = () => {
    switch (item.type) {
      case "nickname_color":
        return (
          <div
            className="shop-card__preview shop-card__preview--nickname"
            style={{ color: item.color ?? undefined }}
          >
            {nickname}
          </div>
        );

      case "title":
        return (
          <div className="shop-card__preview shop-card__preview--title">
            {item.text || item.title}
          </div>
        );

      case "status":
        return (
          <div className="shop-card__preview shop-card__preview--status">
            {item.text || item.title}
          </div>
        );

      case "buff":
        return (
          <div className="shop-card__preview shop-card__preview--buff">
            {item.code === "buff_exp_x2_1h" ? (
              <Zap size={36} />
            ) : (
              <Snowflake size={36} />
            )}
          </div>
        );

      case "icon":
        return (
          <div className="shop-card__preview shop-card__preview--icon">
            <span className="shop-card__nickname-sample">{nickname}</span>
            {imageSrc && <img src={imageSrc} alt={item.title} />}
          </div>
        );

      case "frame":
        return (
          <div className="shop-card__preview shop-card__preview--frame">
            <div className="shop-card__frame-sample">
              {userAvatarUrl ? (
                <img
                  className="shop-card__frame-avatar"
                  src={userAvatarUrl}
                  alt={nickname}
                />
              ) : (
                <span className="shop-card__frame-avatar shop-card__frame-avatar--placeholder">
                  {nickname.charAt(0).toUpperCase()}
                </span>
              )}

              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={item.title}
                  className="shop-card__frame-overlay"
                />
              )}
            </div>
          </div>
        );

      case "avatar":
        return (
          <div className="shop-card__preview shop-card__preview--image">
            {imageSrc ? (
              <img src={imageSrc} alt={item.title} />
            ) : (
              <span>{item.title}</span>
            )}
          </div>
        );

      case "banner":
        return (
          <div className="shop-card__preview shop-card__preview--image shop-card__preview--banner">
            {imageSrc ? (
              <img src={imageSrc} alt={item.title} />
            ) : (
              <span>{item.title}</span>
            )}
          </div>
        );

      case "medal":
      default:
        return (
          <div className="shop-card__preview shop-card__preview--image">
            {imageSrc ? (
              <img src={imageSrc} alt={item.title} />
            ) : (
              <span>{item.title}</span>
            )}
          </div>
        );
    }
  };

  const renderAction = () => {
    if (isBuff) {
      if (!isOwned) {
        return (
          <button
            type="button"
            className="shop-card__button"
            disabled={pending || !canAfford}
            onClick={() => onBuy(item)}
          >
            {pending && pendingType === "buy"
              ? "Покупаем…"
              : canAfford
                ? "Купить"
                : `Не хватает ${item.price - balance}`}
          </button>
        );
      }

      return (
        <button
          type="button"
          className="shop-card__button shop-card__button--activate"
          disabled={pending}
          onClick={() => onActivate(item)}
        >
          {pending && pendingType === "activate"
            ? "Активируем…"
            : `Активировать${item.quantity && item.quantity > 1 ? ` (${item.quantity})` : ""}`}
        </button>
      );
    }

    if (!isOwned) {
      return (
        <button
          type="button"
          className="shop-card__button"
          disabled={pending || !canAfford}
          onClick={() => onBuy(item)}
        >
          {pending && pendingType === "buy"
            ? "Покупаем…"
            : canAfford
              ? "Купить"
              : `Не хватает ${item.price - balance}`}
        </button>
      );
    }

    if (isActive) {
      return (
        <button
          type="button"
          className="shop-card__button shop-card__button--owned"
          disabled={pending}
          onClick={() => onUnequip(item)}
        >
          {pending && pendingType === "unequip" ? "Снимаем…" : "Надето"}
          {!pending && <Check size={16} />}
        </button>
      );
    }

    return (
      <button
        type="button"
        className="shop-card__button shop-card__button--equip"
        disabled={pending}
        onClick={() => onEquip(item)}
      >
        {pending && pendingType === "equip" ? "Надеваем…" : "Надеть"}
      </button>
    );
  };

  return (
    <div
      className={`shop-card${isActive ? " shop-card--active" : ""}${isOwned ? " shop-card--owned" : ""}`}
    >
      <div className="shop-card__preview-wrap">{renderPreview()}</div>

      <div className="shop-card__body">
        <h3 className="shop-card__title">{item.title}</h3>
        {item.description && (
          <p className="shop-card__description">{item.description}</p>
        )}

        {!isOwned && (
          <div className="shop-card__price">
            <img src={currencyIcon} alt={item.currency} />
            <span>{item.price}</span>
          </div>
        )}

        {isBuff && isOwned && (
          <div className="shop-card__price">
            <span className="shop-card__quantity">
              В инвентаре: {item.quantity ?? 0}
            </span>
          </div>
        )}

        {renderAction()}
      </div>
    </div>
  );
}
