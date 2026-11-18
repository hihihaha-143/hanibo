<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GrammarRuleDetailResource;
use App\Http\Resources\GrammarRuleResource;
use App\Models\GrammarRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GrammarRuleController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $search = trim((string) $request->query('search', ''));
        $tab = (string) $request->query('tab', 'all');
        $formId = $request->query('form_id');
        $levelId = $request->query('level_id');
        $perPage = (int) $request->query('per_page', 20);

        $query = GrammarRule::query()
            ->with(['form', 'level'])
            ->leftJoin('user_grammar_rules as ugr', function ($join) use ($userId) {
                $join->on('ugr.grammar_rule_id', '=', 'grammar_rules.id')
                    ->where('ugr.user_id', '=', $userId);
            })
            ->select([
                'grammar_rules.*',
                DB::raw('COALESCE(ugr.status, "new") as user_status'),
                'ugr.interval_days as user_interval_days',
                'ugr.next_review_at as user_next_review_at',
                'ugr.correct_streak as user_correct_streak',
                'ugr.mistakes_count as user_mistakes_count',
            ]);

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('grammar_rules.title', 'like', "%{$search}%")
                    ->orWhere('grammar_rules.construction', 'like', "%{$search}%");
            });
        }

        if ($formId) {
            $query->where('grammar_rules.form_id', (int) $formId);
        }

        if ($levelId) {
            $query->where('grammar_rules.level_id', (int) $levelId);
        }

        switch ($tab) {
            case 'progress':
                $query->whereNotNull('ugr.id')
                    ->whereIn('ugr.status', ['learning', 'review']);
                break;
            case 'learned':
                $query->where('ugr.status', 'learned');
                break;
            case 'review':
                $query->where('ugr.status', 'review');
                break;
        }

        $paginator = $query->orderBy('grammar_rules.id')->paginate($perPage);

        return GrammarRuleResource::collection($paginator);
    }

    public function show(Request $request, GrammarRule $grammarRule)
    {
        $grammarRule->load(['form', 'level', 'phrases', 'lessons']);

        $ugr = $grammarRule->userGrammarRules()
            ->where('user_id', $request->user()->id)
            ->first();

        $grammarRule->user_status = $ugr?->status ?? 'new';
        $grammarRule->user_interval_days = $ugr?->interval_days;
        $grammarRule->user_next_review_at = $ugr?->next_review_at;
        $grammarRule->user_correct_streak = $ugr?->correct_streak;
        $grammarRule->user_mistakes_count = $ugr?->mistakes_count;

        return new GrammarRuleDetailResource($grammarRule);
    }

    public function filters()
    {
        return response()->json([
            'forms' => \App\Models\Form::query()
                ->orderBy('order')
                ->get(['id', 'title']),
            'levels' => \App\Models\Level::query()
                ->orderBy('id')
                ->get(['id', 'title']),
        ]);
    }
}