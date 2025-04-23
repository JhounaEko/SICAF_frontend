<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:8']
        ], [
            'password.regex' => 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial.'
        ]);

        $user = User::where('username', mb_strtoupper(trim($request->username)))->first();

        if ($user && Hash::check($request->password, $user->password)) {

            if ($user->state_id !== 1) {
                return ApiResponse::error('El usuario está deshabilitado.', 403); // 403 Prohibido
            }

            if (!$user->roles()->exists()) {
                return ApiResponse::error('El usuario no tiene roles asignados.', 403); // 403 Prohibido
            }

            $roles = $user->roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    // Agrega otros campos del rol si es necesario
                ];
            });

            try {
                DB::beginTransaction();
                $tokenName = $user->username . ' - ' . now()->format('Y-m-d');
                $token = $user->createToken($tokenName)->plainTextToken;
                DB::commit();
                return ApiResponse::success('Usuario autenticado correctamente.', 200, [
                    'access_token' => $token,
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'state_id' => $user->state_id,
                    'token_type' => 'Bearer',
                    'roles' => $roles
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                return ApiResponse::error('Falló la autenticación debido a un error al crear el token.', 500, $e->getMessage());
            }
        }

        return ApiResponse::error('Credenciales inválidas.', 401);
    }

    public function logout(Request $request)
    {
        try {
            DB::beginTransaction();
            $request->user()->tokens()->delete();
            DB::commit();
            return ApiResponse::success('Sesión cerrada exitosamente.', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al cerrar sesión.', 500, $e->getMessage());
        }
    }
}
