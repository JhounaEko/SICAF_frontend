<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Models\User;
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
            // new Middleware('permission:REGISTER USERS', only: ['store']),
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

            if($request->input('row_num')){
                $users = $query->paginate($request->input('row_num'));
            } else {
                $users = $query->paginate(10);
            }
            

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
    public function store(UserRequest $request)
    {
        try {
            if (auth()->check()) {
                if (!auth()->user()->can('REGISTER USERS')) {
                    return ApiResponse::error('This action is unauthorized.', 403);
                }
            }
            DB::beginTransaction();
            $data = $request->validated();
            if (isset($data['complement']) && !empty($data['complement'])) {
                if (isset($data['identity_card'])) {
                    $data['identity_card'] .= '-' . $data['complement'];
                }
                unset($data['complement']);
            }

            $user = User::create($data);
            if ($request->has('roles')) {
                $user->assignRole($request->input('roles'));
            }
            DB::commit();
            return ApiResponse::success('User registered successfully.', 201, $user);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            DB::rollBack();
            return ApiResponse::error('The Identity Card provided is already in use.', 422); // Código de estado 422 (Unprocessable Entity) es apropiado para errores de validación
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error unexpected ocurred', 500, $e->getMessage());
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
    public function update(UserRequest $request, User $user)
    {
        $this->authorize('view', $user);
        try {
            DB::beginTransaction();
            $data = $request->validated();

            if (isset($data['complement']) && !empty($data['complement'])) {
                if (isset($data['identity_card'])) {
                    $data['identity_card'] .= '-' . $data['complement'];
                }
                unset($data['complement']);
            }
            $data = array_filter($data, function ($value) {
                return $value !== "";
            });

            $user->update($data);

            if ($request->has('roles')) {
                $user->syncRoles($request->input('roles'));
            }
            DB::commit();
            return ApiResponse::success('User updated succesfully.', 200, $user);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            DB::rollBack();
            return ApiResponse::error('The Identity Card provided is already in use.', 422); // Código de estado 422 (Unprocessable Entity) es apropiado para errores de validación

        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error unexpected.', 500, $e->getMessage());
        }
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|confirmed|min:8|confirmed',
        ]);
        try {


            $user = auth()->user();

            if (!Hash::check($request->current_password, $user->password)) {
                return ApiResponse::error(
                    'The current password is incorrect.',
                    422
                );
            }

            $maxChangeAttempts = 0;

            if ($user->password_change_count <= $maxChangeAttempts) {
                return ApiResponse::error(
                    "You've reached your password change limit. Contact an administrator.",
                    403
                );
            }

            DB::beginTransaction();

            $user->password = Hash::make($request->password);
            $user->decrement('password_change_count');
            $user->save();

            DB::commit();

            return ApiResponse::success('Password updated successfully.', 200, $user);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error unexpected occurred.', 500, $e->getMessage());
        }
    }

    public function resetPasswordChangeLimit(User $user)
{
    if (!auth()->user()->can('RESET PASSWORD CHANGE LIMIT')) {
        return ApiResponse::error('This action is unauthorized.', 403);
    }

    try {
        DB::beginTransaction();
        // Reiniciamos el contador a 0.
        $user->password_change_count = 3;
        $user->save();
        DB::commit();

        return ApiResponse::success('Password change limit reset successfully.', 200, $user);
    } catch (\Exception $e) {
        DB::rollBack();
        return ApiResponse::error('An unexpected error occurred.', 500, $e->getMessage());
    }
}
}
