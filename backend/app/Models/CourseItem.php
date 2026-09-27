<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseItem extends Model
{
    protected $fillable = [
        'type',
        'order',
        'title',
        'extra_id',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function extra(): BelongsTo
    {
        return $this->belongsTo(Extra::class);
    }
}