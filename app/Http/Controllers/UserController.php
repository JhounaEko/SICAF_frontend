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
                ->filterByOfficeInitials($request->input('office_initials'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error in sorting', 400, $e->getMessage());
                }
            }

            $perPage = $request->input('row_num');
            $users = $query->paginate($perPage);

            if ($users->isEmpty()) {
                return ApiResponse::error("There're not registered users.", 200);
            }

            $collection = UserResource::collection($users);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Users found', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function store(UserRequest $request, UserService $service)
    {
        try {
            if (auth()->check() && (!auth()->user()->can('REGISTER USERS'))) {
                return ApiResponse::error('This action is unauthorized.', 403);
            }
            $data = $request->validated();
            $user = $service->createUser($data);
            return ApiResponse::success('User registered successfully.', 201, $user);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            return ApiResponse::error('The Identity Card provided is already in use.', 422); // Código de estado 422 (Unprocessable Entity) es apropiado para errores de validación
        } catch (\Exception $e) {
            return ApiResponse::error('An error occurred while registering the user.', 500, $e->getMessage());
        }
    }

    public function show(User $user)
    {
        $this->authorize('view', $user);
        try {
            return ApiResponse::success('User found', 200, UserResource::make($user));
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error occurred while processing the request.', 500, $e->getMessage());
        }
    }

    public function update(UserRequest $request, User $user, UserService $service)
    {
        $this->authorize('view', $user);
        try {
            $data = $request->validated();
            $updatedUser = $service->updateUser($user, $data);
            return ApiResponse::success('User updated succesfully.', 200, $updatedUser);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            return ApiResponse::error('The Identity Card provided is already in use.', 422); // Código de estado 422 (Unprocessable Entity) es apropiado para errores de validación
        } catch (\Exception $e) {
            return ApiResponse::error('An error occurred while updating the user.', 500, $e->getMessage());
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
                return ApiResponse::error('The current password is incorrect.', 422);
            }

            $maxChangeAttempts = 0;
            if ($user->password_change_count <= $maxChangeAttempts) {
                return ApiResponse::error("You've reached your password change limit. Contact an administrator.", 403);
            }

            $updatedUser = $service->updateUserPassword($user, $request->password);

            $adminUsers = User::whereHas('roles', function ($query) {
                $query->where('id', 1);
            })->get();

            foreach ($adminUsers as $admin) {
                $admin->notify(new PasswordChangedNotification($user));
            }
            return ApiResponse::success('Password updated successfully.', 200, $updatedUser);
        } catch (\Exception $e) {
            return ApiResponse::error('An error occurred while updating the password.', 500, $e->getMessage());
        }
    }

    public function resetPasswordChangeLimit(User $user, UserService $service)
    {
        if (!auth()->user()->can('RESET PASSWORD CHANGE LIMIT')) {
            return ApiResponse::error('This action is unauthorized.', 403);
        }
        try {
            $updatedUser = $service->resetPasswordChangeLimit($user, 3);
            return ApiResponse::success('Password change limit reset successfully.', 200, $updatedUser);
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error occurred.', 500, $e->getMessage());
        }
    }
}
