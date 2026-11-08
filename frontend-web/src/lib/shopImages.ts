import type { User } from "../types/user";

const modules = import.meta.glob(
  "../assets/shop/**/*.{png,jpg,jpeg,webp,svg}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
) as Record<string, string>;

const imageMap: Record<string, string> = {};

for (const [path, url] of Object.entries(modules)) {
  const match = path.match(/\/assets\/shop\/(.+)\.(png|jpe?g|webp|svg)$/i);
  if (match) {
    imageMap[match[1]] = url;
  }
}

export function resolveShopImage(
  key: string | null | undefined,
): string | undefined {
  if (!key) return undefined;
  return imageMap[key];
}

/**
 * Возвращает URL аватарки: сначала магазинная (selected_avatar), потом дефолтная (user.avatar).
 */
export function getUserAvatarUrl(user: User | null): string | null {
  if (!user) return null;

  const shopAvatar = resolveShopImage(user.selected_avatar?.image);
  if (shopAvatar) return shopAvatar;

  return user.avatar ?? null;
}
