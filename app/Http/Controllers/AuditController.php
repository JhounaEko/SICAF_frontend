<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Responses\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use OwenIt\Auditing\Models\Audit;
use Illuminate\Support\Str;

class AuditController extends Controller
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW LIST AUDITS', only: ['index']),
            new Middleware('permission:VIEW AUDIT ON MODULE', only: ['show']),
        ];
    }
    public function index(FilterRequest $request)
    {
        try {
            $query = Audit::query();

            if ($request->filled('model')) {
                $modelName = 'App\\Models\\' . $request->input('model');
                $query->where('auditable_type', $modelName);
            }
            if ($request->filled('user')) {
                $query->where('user_id', $request->input('user'));
            }
            if ($request->filled('event')) {
                $query->where('event', $request->input('event'));
            }
            if ($request->filled('auditable_id')) {
                $query->where('auditable_id', $request->input('auditable_id'));
            }

            if ($request->filled('start_date') && $request->filled('end_date')) {
                $start = Carbon::parse($request->input('start_date'))->startOfDay();
                $end = Carbon::parse($request->input('end_date'))->endOfDay();
                $query->whereBetween('created_at', [$start, $end]);
            }

            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc'); // Por defecto descendente para ver los más recientes
            $query->orderBy($sortBy, $sortOrder);

            // Paginar
            $perPage = $request->input('row_num', 10);
            $audits = $query->paginate($perPage);

            if ($audits->isEmpty()) {
                return ApiResponse::error("No audit records found.", 200);
            }

            return ApiResponse::success('Audits retrieved successfully.', 200, $audits);
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error ocurred.', 500, $e->getMessage());
        }
    }

    public function show($id, Request $request)
    {
        try {
            $audit = Audit::findOrFail($id);

            if ($request->filled('model') && $audit->auditable_type !== $request->input('model')) {
                return ApiResponse::error('Audit record not found for the specified model.', 404);
            }

            return ApiResponse::success('Audit record found.', 200, $audit);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ApiResponse::error('The requested audit record was not found.', 404);
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error occurred.', 500, $e->getMessage());
        }
    }
}