<?php

use App\Http\Controllers\AuditController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BudgetRubricController;
use App\Http\Controllers\CorrelativeController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\EnterpriseController;
use App\Http\Controllers\EnterpriseRubricController;
use App\Http\Controllers\FundingOrganizationController;
use App\Http\Controllers\FundingSourceController;
use App\Http\Controllers\HistoricChangeController;
use App\Http\Controllers\HistoricExchangeRateController;
use App\Http\Controllers\HistoricIncrementController;
use App\Http\Controllers\HistoricNoteDetailController;
use App\Http\Controllers\HistoricRegController;
use App\Http\Controllers\IncreaseTypeController;
use App\Http\Controllers\ItemGroupController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MotiveController;
use App\Http\Controllers\NoteTypeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\SummaryController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\SetSortableColumns;
use App\Models\Correlative;
use App\Models\FundingOrganization;
use App\Models\HistoricNoteDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::post('register', [UserController::class, 'store']);
    Route::post('register_personal', [StaffController::class, 'store']);

    Route::post('login', [AuthController::class, 'login']);
    Route::get('offices', [OfficeController::class, 'index'])->name('v1.offices.index')->middleware(SetSortableColumns::class);
    Route::get('places', [PlaceController::class, 'index'])->name('v1.places.index')->middleware(SetSortableColumns::class);
    
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::middleware([SetSortableColumns::class])->group(function () {
            Route::get('states', [StateController::class, 'index'])->name('v1.states.index');
            Route::get('users', [UserController::class, 'index'])->name('v1.users.index');
            Route::get('permissions', [PermissionController::class, 'index'])->name('v1.permissions.index');
            Route::get('roles', [RoleController::class, 'index'])->name('v1.roles.index');
            Route::get('staff', [StaffController::class, 'index'])->name('v1.staff.index');
            Route::get('menus', [MenuController::class, 'index'])->name('v1.menus.index');
            Route::get('motives', [MotiveController::class, 'index'])->name('v1.motives.index');
            Route::get('note_types', [NoteTypeController::class, 'index'])->name('v1.note_types.index');
            Route::get('increase_types', [IncreaseTypeController::class, 'index'])->name('v1.increase_types.index');       
    });
        Route::apiResource('states', StateController::class)->except('index');
        Route::apiResource('offices', OfficeController::class)->except('index');
        Route::apiResource('users', UserController::class)->except('index');
        Route::post('users/password', [UserController::class, 'updatePassword']);  // cambiar password // usesrs
        Route::patch('users/{user}/reset-password-change-limit', [UserController::class, 'resetPasswordChangeLimit']); ////solo el admin puede realizar
            Route::get('increase_types', [IncreaseTypeController::class, 'index'])->name('v1.increase_types.index');
            Route::get('positions', [PositionController::class, 'index'])->name('v1.positions.index');
            Route::get('audits', [AuditController::class, 'index'])->name('v1.audits.index');;
            Route::get('historic_exchange_rates', [HistoricExchangeRateController::class, 'index'])->name('v1.historic_exchange_rates.index');
            Route::get('historic_changes', [HistoricChangeController::class, 'index'])->name('v1.historic_changes.index');
            Route::get('correlatives', [CorrelativeController::class, 'index'])->name('v1.correlatives.index');
            Route::get('historic_note_details', [HistoricNoteDetailController::class, 'index'])->name('v1.historic_note_details.index');
            Route::get('historic_increments', [HistoricIncrementController::class, 'index'])->name('v1.historic_increments.index');
            Route::get('historic_regs', [HistoricRegController::class, 'index'])->name('v1.historic_regs.index');
            Route::get('enterprise_rubrics', [EnterpriseRubricController::class, 'index'])->name('v1.enterprise_rubrics.index');
            Route::get('enterprises', [EnterpriseController::class, 'index'])->name('v1.enterprises.index');
            Route::get('budget_rubrics', [BudgetRubricController::class, 'index'])->name('v1.budget_rubrics.index');
            Route::get('item_groups', [ItemGroupController::class, 'index'])->name('v1.item_groups.index');
            Route::get('funding_sources', [FundingSourceController::class, 'index'])->name('v1.funding_sources.index');
            Route::get('summaries', [SummaryController::class, 'index'])->name('v1.summaries.index');
            Route::get('funding_organizations', [FundingOrganizationController::class, 'index'])->name('v1.funding_organizations.index');
            Route::get('reports', [ReportController::class, 'index'])->name('v1.reports.index');
            Route::get('documents', [DocumentController::class, 'index'])->name('v1.documents.index');
        
        });
        Route::apiResource('states', StateController::class)->except('index');
        Route::apiResource('offices', OfficeController::class)->except('index');
        Route::apiResource('users', UserController::class)->except('index');
        Route::post('users/password', [UserController::class, 'updatePassword']);
        Route::patch('users/{user}/reset-password-change-limit', [UserController::class, 'resetPasswordChangeLimit']);
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::patch('notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);
        Route::patch('notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
        Route::get('audits/{id}', [AuditController::class, 'show']);
        Route::apiResource('permissions', PermissionController::class)->except('index');
        Route::apiResource('roles', RoleController::class)->except('index');
        Route::apiResource('staff', StaffController::class)->except('index');
        Route::apiResource('menus', MenuController::class)->except('index');
        Route::apiResource('motives', MotiveController::class)->except('index');
        Route::apiResource('note_types', NoteTypeController::class)->except('index');
        Route::apiResource('increase_types', IncreaseTypeController::class)->except('index');
        Route::apiResource('positions', PositionController::class)->except('index');
        Route::apiResource('historic_exchange_rates', HistoricExchangeRateController::class)->except('index');
        Route::apiResource('historic_changes', HistoricChangeController::class)->except('index');
        Route::apiResource('correlatives', CorrelativeController::class)->except('index');
        Route::apiResource('historic_note_details', HistoricNoteDetailController::class)->except('index');
        Route::apiResource('historic_increments', HistoricIncrementController::class)->except('index');
        Route::apiResource('historic_regs', HistoricRegController::class)->except('index');
        Route::apiResource('enterprise_rubrics', EnterpriseRubricController::class)->except('index');
        Route::apiResource('enterprises', EnterpriseController::class)->except('index');
        Route::apiResource('budget_rubrics', BudgetRubricController::class)->except('index');
        Route::apiResource('item_groups', ItemGroupController::class)->except('index');
        Route::apiResource('funding_sources', FundingSourceController::class)->except('index');
        Route::apiResource('summaries', SummaryController::class)->except('index');
        Route::apiResource('funding_organizations', FundingOrganizationController::class)->except('index');
        Route::apiResource('reports', ReportController::class)->except('index');
        Route::apiResource('documents', DocumentController::class)->except('index');
        Route::apiResource('places', PlaceController::class)->except('index');

        Route::post('logout', [AuthController::class, 'logout']);
    });

