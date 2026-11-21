<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
            'refresh_daily' => $refreshDaily,
        ], 201);
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
        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
            'refresh_daily' => $refreshDaily,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Выход выполнен.',
        ]);
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