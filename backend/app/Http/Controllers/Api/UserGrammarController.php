<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GrammarRuleResource;
use App\Models\GrammarRule;
use App\Models\UserGrammarRule;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UserGrammarController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $items = UserGrammarRule::query()
            ->with(['grammarRule.form', 'grammarRule.level'])
            ->where('user_id', $userId)
            ->get();

        return response()->json([
            'data' => $items->map(fn (UserGrammarRule $u) => [
                'id' => $u->id,
                'status' => $u->status,
                'interval_days' => $u->interval_days,
                'next_review_at' => $u->next_review_at,
                'correct_streak' => $u->correct_streak,
                'mistakes_count' => $u->mistakes_count,
                'grammar_rule' => new GrammarRuleResource($u->grammarRule),
            ])->values(),
        ]);
    }

    public function start(Request $request, GrammarRule $grammarRule)
    {
        $userId = $request->user()->id;

        $record = UserGrammarRule::firstOrCreate(
            ['user_id' => $userId, 'grammar_rule_id' => $grammarRule->id],
            [
                'status' => 'learning',
                'interval_days' => 0,
                'correct_streak' => 0,
                'mistakes_count' => 0,
                'started_at' => now(),
                'next_review_at' => now()->addDay(),
            ]
        );

        return response()->json(['data' => $record]);
    }

    public function review(Request $request, GrammarRule $grammarRule)
    {
        $request->validate([
            'correct' => 'required|boolean',
        ]);

        $userId = $request->user()->id;
        $correct = (bool) $request->input('correct');

        $record = UserGrammarRule::firstOrCreate(
            ['user_id' => $userId, 'grammar_rule_id' => $grammarRule->id],
            [
                'status' => 'learning',
                'interval_days' => 0,
                'correct_streak' => 0,
                'mistakes_count' => 0,
                'started_at' => now(),
            ]
        );

        if ($correct) {
            $record->correct_streak += 1;
            $record->mistakes_count = 0;

            $schedule = [1, 3, 7, 14, 30, 60];
            $idx = min($record->correct_streak - 1, count($schedule) - 1);
            $record->interval_days = $schedule[$idx];
            $record->next_review_at = Carbon::now()->addDays($record->interval_days);

            if ($record->correct_streak >= 5) {
                $record->status = 'learned';
            } else {
                $record->status = 'learning';
            }
        } else {
            $record->correct_streak = 0;
            $record->mistakes_count += 1;
            $record->interval_days = 1;
            $record->next_review_at = Carbon::now()->addDay();
            $record->status = 'review';
        }

        $record->save();

        return response()->json(['data' => $record]);
    }

    public function reset(Request $request, GrammarRule $grammarRule)
    {
        UserGrammarRule::query()
            ->where('user_id', $request->user()->id)
            ->where('grammar_rule_id', $grammarRule->id)
            ->delete();

        return response()->json(['data' => ['ok' => true]]);
    }
}