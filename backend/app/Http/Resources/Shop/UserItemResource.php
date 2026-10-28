<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'shop_item_id' => $this->shop_item_id,
            'quantity' => (int) $this->quantity,
            'purchased_at' => $this->purchased_at?->toIso8601String(),
            'active' => (bool) ($this->active ?? false),
            'item' => new ShopItemResource($this->whenLoaded('shopItem')),
        ];
    }
}