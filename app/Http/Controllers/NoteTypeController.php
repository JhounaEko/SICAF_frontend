<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\MotiveRequest;
use App\Http\Requests\NoteTypeRequest;
use App\Http\Resources\NoteTypeResource;
use App\Http\Responses\ApiResponse;
use App\Models\NoteType;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class NoteTypeController extends Controller
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW NOTE_TYPES', only: ['index', 'show']),
            new Middleware('permission:REGISTER NOTE_TYPES', only: ['store']),
            new Middleware('permission:UPDATE NOTE_TYPES', only: ['update'])
        ];
    }
    public function index(FilterRequest $request)
    {
        try {
            $query = NoteType::query();
            $query->filterByState($request->input('state'))
                ->filterByNameOrDescription($request->input('search'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error in sorting.', 400, $e->getMessage());
                }
            }
            $perPage = $request->input('row_num');
            $note_types = $query->paginate($perPage);
            if ($note_types->isEmpty()) {
                return ApiResponse::error("There're not registered note types.", 200);
            }
            $collection = NoteTypeResource::collection($note_types);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Note types found.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error ocurred.', 500, $e->getMessage());
        }
    }

    public function store(NoteTypeRequest $request)
    {
        try {
            DB::beginTransaction();
            $note_type = NoteType::create($request->validated());
            DB::commit();
            return ApiResponse::success('Note type created successfully.', 201, $note_type);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An unexpected error ocurred.', 500, $e->getMessage());
        }
    }

    public function show(NoteType $noteType)
    {
        try {
            return ApiResponse::success('Note found.', 201, NoteTypeResource::make($noteType));
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function update(NoteTypeRequest $request, NoteType $noteType)
    {
        try {
            DB::beginTransaction();
            $noteType->update($request->validated());
            DB::commit();
            return ApiResponse::success('Note type updated successfully.', 200, $noteType);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }
}
