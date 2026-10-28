<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'type' => $this->type,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'currency' => $this->currency,
            'image' => $this->image,
            'color' => $this->color,
            'text' => $this->text,
            'max_active' => $this->max_active,
            'is_hidden' => $this->is_hidden,
            'is_purchasable' => $this->is_purchasable,
            'sort_order' => $this->sort_order,
            'owned' => (bool) ($this->owned ?? false),
            'active' => (bool) ($this->active ?? false),
            'quantity' => isset($this->quantity) ? (int) $this->quantity : null,
        ];
    }
}