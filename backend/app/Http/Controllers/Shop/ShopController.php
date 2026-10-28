<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Resources\Shop\ShopItemResource;
use App\Http\Resources\Shop\UserItemResource;
use App\Http\Resources\UserResource;
use App\Models\Shop\ShopItem;
use App\Models\Shop\UserItem;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ShopController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $ownedItemIds = $user->userItems()->pluck('shop_item_id')->all();
        $ownedSet = array_flip($ownedItemIds);
        $activeIds = $this->getActiveItemIds($user);
        $activeSet = array_flip($activeIds);

        $items = ShopItem::query()
            ->where('is_purchasable', true)
            ->where(function ($q) use ($ownedItemIds) {
                $q->where('is_hidden', false)
                    ->orWhereIn('id', $ownedItemIds);
            })
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        $items->each(function (ShopItem $item) use ($ownedSet, $activeSet) {
            $item->owned = isset($ownedSet[$item->id]);
            $item->active = isset($activeSet[$item->id]);
        });

        return response()->json([
            'data' => ShopItemResource::collection($items)->resolve(),
        ]);
    }

    public function inventory(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $activeIds = $this->getActiveItemIds($user);
        $activeSet = array_flip($activeIds);

        $userItems = $user->userItems()
            ->with('shopItem')
            ->get();

        $userItems->each(function (UserItem $userItem) use ($activeSet) {
            $userItem->active = isset($activeSet[$userItem->shop_item_id]);
        });

        return response()->json([
            'data' => UserItemResource::collection($userItems)->resolve(),
        ]);
    }

    public function buy(Request $request, ShopItem $item): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! $item->is_purchasable || $item->is_hidden && ! $user->ownsShopItem($item->id)) {
            throw ValidationException::withMessages([
                'item' => 'Этот предмет нельзя купить.',
            ]);
        }

        if (! $item->isConsumable() && $user->ownsShopItem($item->id)) {
            throw ValidationException::withMessages([
                'item' => 'Этот предмет уже куплен.',
            ]);
        }

        $currencyField = $item->currency === ShopItem::CURRENCY_STRAWBERRY
            ? 'strawberry'
            : 'blueberry';

        if ($user->{$currencyField} < $item->price) {
            throw ValidationException::withMessages([
                'balance' => 'Недостаточно средств.',
            ]);
        }

        DB::transaction(function () use ($user, $item, $currencyField) {
            $user->{$currencyField} -= $item->price;
            $user->save();

            $userItem = $user->userItems()
                ->where('shop_item_id', $item->id)
                ->lockForUpdate()
                ->first();

            if ($userItem) {
                $userItem->quantity += 1;
                $userItem->purchased_at = now();
                $userItem->save();
            } else {
                $user->userItems()->create([
                    'shop_item_id' => $item->id,
                    'quantity' => 1,
                    'purchased_at' => now(),
                ]);
            }
        });

        $user->refresh();

        return response()->json([
            'user' => (new UserResource($user))->resolve(),
            'item' => (new ShopItemResource($item))->resolve(),
        ]);
    }

    public function equip(Request $request, ShopItem $item): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! $user->ownsShopItem($item->id)) {
            throw ValidationException::withMessages([
                'item' => 'Предмет не куплен.',
            ]);
        }

        if ($item->isConsumable()) {
            throw ValidationException::withMessages([
                'item' => 'Бусты нельзя надеть.',
            ]);
        }

        $field = $this->activeFieldForType($item->type);

        if ($field === null) {
            throw ValidationException::withMessages([
                'item' => 'Этот тип предмета нельзя надеть.',
            ]);
        }

        if ($item->type === ShopItem::TYPE_ICON) {
            $current = $user->selected_icon_ids ?? [];
            $current = array_values(array_unique(array_map('intval', $current)));

            if (! in_array($item->id, $current, true)) {
                $current[] = $item->id;
            }

            $max = $item->max_active > 0 ? $item->max_active : 3;

            if (count($current) > $max) {
                $current = array_slice($current, -$max);
            }

            $user->selected_icon_ids = $current;
            $user->save();
        } else {
            $user->{$field} = $item->id;
            $user->save();
        }

        $user->refresh();

        return response()->json([
            'user' => (new UserResource($user))->resolve(),
        ]);
    }

    public function unequip(Request $request, ShopItem $item): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($item->type === ShopItem::TYPE_ICON) {
            $current = $user->selected_icon_ids ?? [];
            $current = array_values(array_filter(
                array_map('intval', $current),
                fn ($id) => $id !== $item->id,
            ));
            $user->selected_icon_ids = $current ?: null;
            $user->save();
        } else {
            $field = $this->activeFieldForType($item->type);

            if ($field !== null && $user->{$field} === $item->id) {
                $user->{$field} = null;
                $user->save();
            }
        }

        $user->refresh();

        return response()->json([
            'user' => (new UserResource($user))->resolve(),
        ]);
    }

    public function activate(Request $request, ShopItem $item): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! $item->isConsumable()) {
            throw ValidationException::withMessages([
                'item' => 'Этот предмет нельзя активировать.',
            ]);
        }

        $userItem = $user->userItems()
            ->where('shop_item_id', $item->id)
            ->lockForUpdate()
            ->first();

        if (! $userItem || $userItem->quantity < 1) {
            throw ValidationException::withMessages([
                'item' => 'Предмет не куплен.',
            ]);
        }

        DB::transaction(function () use ($user, $item, $userItem) {
            match ($item->code) {
                'buff_exp_x2_1h' => $this->applyExpBoost($user),
                'buff_streak_freeze' => $this->applyStreakFreeze($user),
                default => throw ValidationException::withMessages([
                    'item' => 'Неизвестный тип буста.',
                ]),
            };

            $userItem->quantity -= 1;

            if ($userItem->quantity <= 0) {
                $userItem->delete();
            } else {
                $userItem->save();
            }
        });

        $user->refresh();

        return response()->json([
            'user' => (new UserResource($user))->resolve(),
            'item' => (new ShopItemResource($item))->resolve(),
        ]);
    }

    private function applyExpBoost(User $user): void
    {
        $base = $user->exp_boost_until && $user->exp_boost_until->isFuture()
            ? $user->exp_boost_until->copy()
            : now();

        $user->exp_boost_until = $base->copy()->addHour();
        $user->save();
    }

    private function applyStreakFreeze(User $user): void
    {
        $user->streak_freezes = ($user->streak_freezes ?? 0) + 1;
        $user->save();
    }

    private function activeFieldForType(string $type): ?string
    {
        return match ($type) {
            ShopItem::TYPE_STATUS => 'selected_status_id',
            ShopItem::TYPE_AVATAR => 'selected_avatar_id',
            ShopItem::TYPE_FRAME => 'selected_frame_id',
            ShopItem::TYPE_BANNER => 'selected_banner_id',
            ShopItem::TYPE_NICKNAME_COLOR => 'selected_nickname_color_id',
            ShopItem::TYPE_MEDAL => 'selected_medal_id',
            ShopItem::TYPE_ICON => 'selected_icon_ids',
            default => null,
        };
    }

    private function getActiveItemIds(User $user): array
    {
        $ids = array_filter([
            $user->selected_status_id,
            $user->selected_avatar_id,
            $user->selected_frame_id,
            $user->selected_banner_id,
            $user->selected_nickname_color_id,
            $user->selected_medal_id,
        ]);

        foreach ((array) ($user->selected_icon_ids ?? []) as $iconId) {
            $ids[] = (int) $iconId;
        }

        return array_values(array_unique(array_map('intval', $ids)));
    }
}