<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    private const USER_RELATIONS = [
        'selectedTitle',
        'selectedStatus',
        'selectedAvatar',
        'selectedFrame',
        'selectedBanner',
        'selectedNicknameColor',
        'selectedMedal',
    ];

    public function register(Request $request)
    {
        $data = $request->validate([
            'nickname' => ['required', 'string', 'min:3', 'max:32', 'alpha_dash', 'unique:users,nickname'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ]);

        $user = User::create([
            'nickname' => $data['nickname'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'streak_freezes' => 1,
        ]);

        $user->refresh();
        $user->load(self::USER_RELATIONS);
        $refreshDaily = $user->refreshDailyExp();
        [$token, $refresh] = $this->issueTokens($user);

        return $this->withRefreshCookie(
            response()->json([
                'user' => new UserResource($user),
                'token' => $token,
                'refresh_daily' => $refreshDaily,
            ], 201),
            $refresh,
            $request,
        );
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        $identifier = trim($data['email']);
        $field = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'nickname';

        if (! Auth::attempt([$field => $identifier, 'password' => $data['password']])) {
            return response()->json([
                'message' => 'Неверный email/никнейм или пароль.',
            ], 401);
        }

        /** @var User $user */
        $user = Auth::user();
        $user->load(self::USER_RELATIONS);
        $refreshDaily = $user->refreshDailyExp();
        [$token, $refresh] = $this->issueTokens($user);

        return $this->withRefreshCookie(
            response()->json([
                'user' => new UserResource($user),
                'token' => $token,
                'refresh_daily' => $refreshDaily,
            ]),
            $refresh,
            $request,
        );
    }

    public function logout(Request $request)
    {
        $refresh = $request->cookie('hanibo_refresh');
        if ($refresh) {
            RefreshToken::where('token_hash', hash('sha256', $refresh))->delete();
        }

        $request->user()->currentAccessToken()?->delete();

        return response()
            ->json(['message' => 'Выход выполнен.'])
            ->withCookie(Cookie::forget('hanibo_refresh'));
    }

    public function logoutAll(Request $request): JsonResponse
    {
        $user = $request->user();
        RefreshToken::where('user_id', $user->id)->delete();
        $user->tokens()->delete();

        return response()
            ->json(['message' => 'Сеансы завершены на всех устройствах.'])
            ->withCookie(Cookie::forget('hanibo_refresh'));
    }

    public function refresh(Request $request): JsonResponse
    {
        $refresh = $request->cookie('hanibo_refresh');
        if (!$refresh) {
            return response()->json(['message' => 'Refresh token отсутствует.'], 401);
        }

        $record = RefreshToken::with('user')
            ->where('token_hash', hash('sha256', $refresh))
            ->where('expires_at', '>', now())
            ->first();

        if (!$record || !$record->user) {
            return response()->json(['message' => 'Сессия истекла.'], 401);
        }

        $user = $record->user;
        $record->delete();

        $user->load(self::USER_RELATIONS);
        $refreshDaily = $user->refreshDailyExp();
        [$token, $newRefresh] = $this->issueTokens($user);

        return $this->withRefreshCookie(
            response()->json([
                'user' => new UserResource($user),
                'token' => $token,
                'refresh_daily' => $refreshDaily,
            ]),
            $newRefresh,
            $request,
        );
    }

    /** @return array{0:string,1:string} */
    private function issueTokens(User $user): array
    {
        $access = $user->createToken(
            'spa',
            ['*'],
            now()->addMinutes(30),
        )->plainTextToken;

        $refresh = Str::random(64);
        RefreshToken::create([
            'user_id' => $user->id,
            'token_hash' => hash('sha256', $refresh),
            'expires_at' => now()->addDays(30),
        ]);

        return [$access, $refresh];
    }

    private function withRefreshCookie(
        JsonResponse $response,
        string $refresh,
        Request $request,
    ): JsonResponse {
        return $response->cookie(
            'hanibo_refresh',
            $refresh,
            60 * 24 * 30,
            '/',
            null,
            $request->isSecure(),
            true,
            false,
            'lax',
        );
    }

    public function me(Request $request)
    {
        /** @var User $user */
        $user = $request->user();
        $user->load(self::USER_RELATIONS);
        $refreshDaily = $user->refreshDailyExp();

        return response()->json([
            'user' => new UserResource($user),
            'refresh_daily' => $refreshDaily,
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if ($user) {
            $token = Str::random(64);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $user->email],
                [
                    'token' => hash('sha256', $token),
                    'created_at' => now(),
                ],
            );

            $frontendUrl = rtrim((string) config('app.frontend_url', 'http://localhost:5173'), '/');
            $resetUrl = $frontendUrl . '/reset-password?token=' . urlencode($token) . '&email=' . urlencode($user->email);

            Mail::raw(
                "Сброс пароля Hanibo\n\nПерейдите по ссылке (действует 1 час):\n{$resetUrl}\n\nЕсли вы не запрашивали сброс — просто проигнорируйте письмо.",
                fn ($message) => $message
                    ->to($user->email)
                    ->subject('Сброс пароля Hanibo'),
            );
        }

        return response()->json([
            'message' => 'Если аккаунт существует, письмо со ссылкой отправлено.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ]);

        $reset = DB::table('password_reset_tokens')
            ->where('email', $data['email'])
            ->first();

        if (
            !$reset
            || !hash_equals($reset->token, hash('sha256', $data['token']))
            || !$reset->created_at
            || strtotime((string) $reset->created_at) < now()->subHour()->timestamp
        ) {
            return response()->json([
                'message' => 'Ссылка для сброса пароля недействительна или истекла.',
            ], 422);
        }

        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'Ссылка для сброса пароля недействительна или истекла.',
            ], 422);
        }

        $user->password = Hash::make($data['password']);
        $user->save();
        $user->tokens()->delete();
        RefreshToken::where('user_id', $user->id)->delete();

        DB::table('password_reset_tokens')->where('email', $data['email'])->delete();

        return response()->json([
            'message' => 'Пароль обновлён. Войдите с новым паролем.',
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validate([
            'nickname' => [
                'required',
                'string',
                'min:3',
                'max:32',
                'alpha_dash',
                Rule::unique('users', 'nickname')->ignore($user->id),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
        ]);

        $user->fill($data)->save();
        $user->load(self::USER_RELATIONS);
        $user->refresh();

        return response()->json([
            'user' => new UserResource($user),
        ]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $data = $request->validate([
            'daily_exp_goal' => ['sometimes', 'integer', 'min:10', 'max:1000'],
            'timezone' => ['sometimes', 'string', 'timezone'],
        ]);

        /** @var User $user */
        $user = $request->user();

        if (array_key_exists('daily_exp_goal', $data)) {
            $user->daily_exp_goal = $data['daily_exp_goal'];
        }
        if (array_key_exists('timezone', $data)) {
            $user->timezone = $data['timezone'];
        }
        $user->save();
        $user->load(self::USER_RELATIONS);
        $refreshDaily = $user->refreshDailyExp();

        return response()->json([
            'user' => new UserResource($user),
            'refresh_daily' => $refreshDaily,
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ]);

        if (! Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Текущий пароль указан неверно.',
                'errors' => ['current_password' => ['Текущий пароль указан неверно.']],
            ], 422);
        }

        $user->password = Hash::make($data['password']);
        $user->save();
        RefreshToken::where('user_id', $user->id)->delete();

        return response()->json(['message' => 'Пароль обновлён.']);
    }

    public function updateTimezone(Request $request)
    {
        $data = $request->validate([
            'timezone' => ['required', 'string', 'timezone'],
        ]);

        /** @var User $user */
        $user = $request->user();

        if ($user->timezone !== $data['timezone']) {
            $user->timezone = $data['timezone'];
            $user->save();
        }

        $user->load(self::USER_RELATIONS);
        $refreshDaily = $user->refreshDailyExp();

        return response()->json([
            'user' => new UserResource($user),
            'refresh_daily' => $refreshDaily,
        ]);
    }
}