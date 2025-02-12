<?php

use App\Http\Controllers\OfficeController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\SetSortableColumns;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix('v1')->group(function(){ 
    Route::middleware([SetSortableColumns::class])->group(function(){
        Route::get('states', [StateController::class, 'index'])->name('v1.states.index');
        Route::get('offices', [OfficeController::class, 'index'])->name('v1.offices.index');
        Route::get('users', [UserController::class, 'index'])->name('v1.users.index');
    });
    Route::apiResource('states', StateController::class)->except('index');
    Route::apiResource('offices', OfficeController::class)->except('index');
    Route::apiResource('users', UserController::class)->except('index');
});