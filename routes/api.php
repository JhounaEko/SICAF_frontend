<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\SetSortableColumns;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix('v1')->group(function(){ 
    Route::post('register', [UserController::class, 'store']);
    Route::post('login',[AuthController::class, 'login']);
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::middleware([SetSortableColumns::class])->group(function(){
            Route::get('states', [StateController::class, 'index'])->name('v1.states.index');
            Route::get('offices', [OfficeController::class, 'index'])->name('v1.offices.index');
            Route::get('users', [UserController::class, 'index'])->name('v1.users.index');
            Route::get('permissions', [PermissionController::class, 'index'])->name('v1.permissions.index');
            Route::get('roles', [RoleController::class, 'index'])->name('v1.roles.index');
            Route::get('employees', [EmployeeController::class , 'index'])->name('v1.employees.index');
        });
        Route::apiResource('states', StateController::class)->except('index');
        Route::apiResource('offices', OfficeController::class)->except('index');
        Route::apiResource('users', UserController::class)->except('index');
        Route::apiResource('permissions', PermissionController::class)->except('index');
        Route::apiResource('roles', RoleController::class)->except('index');
        Route::apiResource('employees', EmployeeController::class)->except('index');
        Route::post('logout', [AuthController::class, 'logout']);
    });    
});