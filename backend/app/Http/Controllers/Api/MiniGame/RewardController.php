<?php

namespace App\Http\Controllers\Api\MiniGame;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RewardController extends Controller
{
    /**
     * Начисление черники по итогу партии мини-игры.
     *
     * Пороги:
     *  < 70%  → 0
     *  70–84% → 1
     *  85–99% → 2
     *  100%   → 3
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'correct' => ['required', 'integer', 'min:0'],
            'total' => ['required', 'integer', 'min:1'],
        ]);

        $correct = $data['correct'];
        $total = $data['total'];

        if ($correct > $total) {
            return response()->json(['message' => 'Invalid counts'], 422);
        }

        $percent = ($correct / $total) * 100;

        $reward = match (true) {
            $percent >= 100 => 3,
            $percent >= 85  => 2,
            $percent >= 70  => 1,
            default         => 0,
        };

        $user = $request->user();

        if ($reward > 0) {
            $user->increment('blueberry', $reward);
        }

        $user->refresh();

        return response()->json([
            'reward' => $reward,
            'percent' => (int) round($percent),
            'blueberry' => $user->blueberry,
        ]);
    }
}