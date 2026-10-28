<?php

namespace App\Models\Shop;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'shop_item_id',
        'quantity',
        'purchased_at',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'purchased_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function shopItem(): BelongsTo
    {
        return $this->belongsTo(ShopItem::class);
    }
}