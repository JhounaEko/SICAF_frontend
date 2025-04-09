<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\IncreaseTypeController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MotiveController;
use App\Http\Controllers\NoteTypeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\SetSortableColumns;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::post('register', [UserController::class, 'store']);
    Route::post('login', [AuthController::class, 'login']);
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::middleware([SetSortableColumns::class])->group(function () {
            Route::get('states', [StateController::class, 'index'])->name('v1.states.index');
            Route::get('offices', [OfficeController::class, 'index'])->name('v1.offices.index');
            Route::get('users', [UserController::class, 'index'])->name('v1.users.index');
            Route::get('permissions', [PermissionController::class, 'index'])->name('v1.permissions.index');
            Route::get('roles', [RoleController::class, 'index'])->name('v1.roles.index');
            Route::get('employees', [EmployeeController::class, 'index'])->name('v1.employees.index');
            Route::get('menus', [MenuController::class, 'index'])->name('v1.menus.index');
            Route::get('motives', [MotiveController::class, 'index'])->name('v1.motives.index');
            Route::get('note_types', [NoteTypeController::class, 'index'])->name('v1.note_types.index');
            Route::get('increase_types', [IncreaseTypeController::class, 'index'])->name('v1.increase_types.index');
            Route::get('positions', [PositionController::class, 'index'])->name('v1.positions.index');
        });
        Route::apiResource('states', StateController::class)->except('index');
        Route::apiResource('offices', OfficeController::class)->except('index');
        Route::apiResource('users', UserController::class)->except('index');
        Route::post('users/password', [UserController::class, 'updatePassword']);
        Route::patch('users/{user}/reset-password-change-limit', [UserController::class, 'resetPasswordChangeLimit']);
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::patch('notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);
        Route::patch('notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
        Route::apiResource('permissions', PermissionController::class)->except('index');
        Route::apiResource('roles', RoleController::class)->except('index');
        Route::apiResource('employees', EmployeeController::class)->except('index');
        Route::apiResource('menus', MenuController::class)->except('index');
        Route::apiResource('motives', MotiveController::class)->except('index');
        Route::apiResource('note_types', NoteTypeController::class)->except('index');
        Route::apiResource('increase_types', IncreaseTypeController::class)->except('index');
        Route::apiResource('positions', PositionController::class)->except('index');

        Route::post('logout', [AuthController::class, 'logout']);
    });
});
