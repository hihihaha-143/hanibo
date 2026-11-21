<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserCourseProgress extends Model
{
    protected $fillable = [
        'user_id',
        'course_item_id',
        'words_percent',
        'grammar_percent',
        'final_percent',
        'test_percent',
        'lesson_reward_tier',
        'test_reward_tier',
    ];

    protected function casts(): array
    {
        return [
            'words_percent' => 'integer',
            'grammar_percent' => 'integer',
            'final_percent' => 'integer',
            'test_percent' => 'integer',
            'lesson_reward_tier' => 'integer',
            'test_reward_tier' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function courseItem(): BelongsTo
    {
        return $this->belongsTo(CourseItem::class);
    }
}
