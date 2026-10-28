<?php

namespace App\Models\Shop;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShopItem extends Model
{
    use HasFactory;

    public const TYPE_TITLE = 'title';
    public const TYPE_STATUS = 'status';
    public const TYPE_AVATAR = 'avatar';
    public const TYPE_FRAME = 'frame';
    public const TYPE_BANNER = 'banner';
    public const TYPE_NICKNAME_COLOR = 'nickname_color';
    public const TYPE_ICON = 'icon';
    public const TYPE_MEDAL = 'medal';
    public const TYPE_BUFF = 'buff';

    public const CURRENCY_BLUEBERRY = 'blueberry';
    public const CURRENCY_STRAWBERRY = 'strawberry';

    protected $fillable = [
        'code',
        'type',
        'title',
        'description',
        'price',
        'currency',
        'image',
        'color',
        'text',
        'is_hidden',
        'is_purchasable',
        'max_active',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'integer',
        'is_hidden' => 'boolean',
        'is_purchasable' => 'boolean',
        'max_active' => 'integer',
        'sort_order' => 'integer',
    ];

    public function userItems(): HasMany
    {
        return $this->hasMany(UserItem::class);
    }

    public function isBuff(): bool
    {
        return $this->type === self::TYPE_BUFF;
    }

    public function isConsumable(): bool
    {
        return $this->isBuff();
    }
}