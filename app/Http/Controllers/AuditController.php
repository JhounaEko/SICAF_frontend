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
<<<<<<< HEAD
                $modelName = 'App\\Models\\' . $request->input('model');
=======
                $modelInput = strtolower($request->input('model'));
                $modelName = 'App\\Models\\' . trim(Str::studly(($modelInput)));
                // var_dump($modelName);
>>>>>>> 9ba86a3afbf92d7b37b3fc89b2a3ca852a226ad5
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
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $perPage = $request->input('row_num', 10);
            $audits = $query->paginate($perPage);

            if ($audits->isEmpty()) {
                return ApiResponse::error("No se encontraron registros de auditoría.", 200);
            }

            return ApiResponse::success('Registros de auditoría recuperados correctamente.', 200, $audits);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function show($id, Request $request)
    {
        try {
            $audit = Audit::findOrFail($id);

            if ($request->filled('model') && $audit->auditable_type !== $request->input('model')) {
                return ApiResponse::error('No se encontró el registro de auditoría para el modelo especificado.', 404);
            }

            return ApiResponse::success('Registro de auditoría encontrado.', 200, $audit);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ApiResponse::error('No se encontró el registro de auditoría solicitado.', 404);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }
}
