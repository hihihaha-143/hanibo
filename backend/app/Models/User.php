<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nickname',
        'email',
        'password',
        'role',
        'language_level',
        'avatar',
        'strawberry',
        'blueberry',
        'exp',
        'streak_current',
        'streak_best',
        'streak_last_date',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'streak_last_date' => 'date',
            'strawberry' => 'integer',
            'blueberry' => 'integer',
            'exp' => 'integer',
            'streak_current' => 'integer',
            'streak_best' => 'integer',
        ];
    }

    public function alphabetProgress(): HasMany
    {
        return $this->hasMany(AlphabetProgress::class);
    }
}