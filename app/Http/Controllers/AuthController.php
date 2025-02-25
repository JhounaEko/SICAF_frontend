<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:8', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/']
        ]);
        $user = User::where('username', mb_strtoupper(trim($request->username)))->first();

        if ($user && Hash::check($request->password, $user->password)) {
            $tokenName = $user->username . ' - ' . now()->format('Y-m-d');
            $token = $user->createToken($tokenName)->plainTextToken;

            return ApiResponse::success('User successfully authenticated.', 200, [
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        }

        return ApiResponse::error('Invalid credentials.', 401);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return ApiResponse::success('Session closed succesfully.', 200);
    }
}
