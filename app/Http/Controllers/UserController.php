<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use App\Notifications\NewUserNotification;
use App\Notifications\PasswordChangedNotification;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller implements HasMiddleware
{
    use AuthorizesRequests;
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW USERS', only: ['index']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = User::query();
            $query->filterByState($request->input('state'))
                ->filterByOffice($request->input('office'))
                ->filterByUsername($request->input('username'))
                ->filterByEmail($request->input('email'))
                ->filterByIdentityCard($request->input('identity_card'))
                ->filterByIssuedBy($request->input('issued_by'))
                ->filterByName($request->input('search'))
                ->filterByOfficeName($request->input('office_name'))
                ->filterByPlaceName($request->input('place_name'))

                ->filterByStateName($request->input('state_name'))
                ->filterByOfficeInitials($request->input('office_initials'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error al ordenar.', 400, $e->getMessage());
                }
            }

            if ($request->input('row_num')) {
                $users = $query->paginate($request->input('row_num'));
            } else {
                $users = $query->paginate(10);
            }

            if ($users->isEmpty()) {
                return ApiResponse::error('No hay usuarios registrados.', 200);
            }

            $collection = UserResource::collection($users);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Usuarios encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(UserRequest $request, UserService $service)
    {
        try {
            if (auth()->check() && (!auth()->user()->can('REGISTER USERS'))) {
                return ApiResponse::error('Esta acción no está autorizada.', 403);
            }
            $data = $request->validated();
            $user = $service->createUser($data);
            return ApiResponse::success('Usuario registrado exitosamente.', 201, $user);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            return ApiResponse::error('El carnet de identidad proporcionado ya está en uso.', 422);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error al registrar al usuario.', 500, $e->getMessage());
        }
    }

    public function show(User $user)
    {
        $this->authorize('view', $user);
        try {
            return ApiResponse::success('Usuario encontrado.', 200, UserResource::make($user));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado al procesar la solicitud.', 500, $e->getMessage());
        }
    }

    public function update(UserRequest $request, User $user, UserService $service)
    {
        $this->authorize('view', $user);
        try {
            $data = $request->validated();
            $updatedUser = $service->updateUser($user, $data);
            return ApiResponse::success('Usuario actualizado exitosamente.', 200, $updatedUser);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            return ApiResponse::error('El carnet de identidad proporcionado ya está en uso.', 422);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error al actualizar al usuario.', 500, $e->getMessage());
        }
    }

    public function updatePassword(Request $request, UserService $service)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|confirmed|min:8|confirmed',
        ]);
        try {
            $user = auth()->user();
            if (!Hash::check($request->current_password, $user->password)) {
                return ApiResponse::error('La contraseña actual es incorrecta.', 422);
            }

            $maxChangeAttempts = 0;
            if ($user->password_change_count <= $maxChangeAttempts) {
                return ApiResponse::error('Has alcanzado el límite de cambios de contraseña. Contacta con un administrador.', 403);
            }

            $updatedUser = $service->updateUserPassword($user, $request->password);

            $adminUsers = User::whereHas('roles', function ($query) {
                $query->where('id', 1);
            })->get();

            foreach ($adminUsers as $admin) {
                $admin->notify(new PasswordChangedNotification($user));
            }
            return ApiResponse::success('Contraseña actualizada exitosamente.', 200, $updatedUser);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error al actualizar la contraseña.', 500, $e->getMessage());
        }
    }

    public function resetPasswordChangeLimit(User $user, UserService $service)
    {
        if (!auth()->user()->can('RESET PASSWORD CHANGE LIMIT')) {
            return ApiResponse::error('Esta acción no está autorizada.', 403);
        }
        try {
            $updatedUser = $service->resetPasswordChangeLimit($user, 3);
            return ApiResponse::success('Límite de cambio de contraseña restablecido exitosamente.', 200, $updatedUser);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }
}
