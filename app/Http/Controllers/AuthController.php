<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request){
        $request->validate([
            'username' => ['required', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:8', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/']
        ]);
        if (!auth()->attempt(['username' => mb_strtoupper(trim($request->username)), 'password' => $request->password])) {
            return ApiResponse::error('Invalid credentials.', 401);
        }
        $user = User::where('username', mb_strtoupper(trim($request->username)))->first();
        $tokenName = $user->username . ' - ' . now()->format('Y-m-d');
        $token = $user->createToken($tokenName)->plainTextToken;

        return ApiResponse::success('User successfully authenticated.', 200, [
             'access_token' => $token,
            'token_type'   => 'Bearer'
        ]);

    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return ApiResponse::success('Session closed succesfully.', 200);
    }
}
