<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseItem extends Model
{
    protected $fillable = [
        'type',
        'order',
        'title',
    ];

    protected $casts = [
        'order' => 'integer',
    ];
}