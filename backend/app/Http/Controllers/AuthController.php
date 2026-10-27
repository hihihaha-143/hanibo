<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'nickname' => ['required', 'string', 'min:3', 'max:32', 'alpha_dash', 'unique:users,nickname'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)],
        ]);

        $user = User::create([
            'nickname' => $data['nickname'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'streak_freezes' => 1,
        ]);

        $user->refresh();
        $user->load('selectedTitle');
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
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt(['email' => $data['email'], 'password' => $data['password']])) {
            return response()->json([
                'message' => 'Неверный email или пароль.',
            ], 401);
        }

        /** @var User $user */
        $user = Auth::user();
        $user->load('selectedTitle');
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
        $user->load('selectedTitle');
        $refreshDaily = $user->refreshDailyExp();

        return response()->json([
            'user' => new UserResource($user),
            'refresh_daily' => $refreshDaily,
        ]);
    }
}