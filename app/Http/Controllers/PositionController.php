<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\PositionRequest;
use App\Http\Resources\PositionResource;
use App\Http\Responses\ApiResponse;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PositionController extends Controller
{
    public function index(FilterRequest $request)
    {
        try {
            $query = Position::query();

            $query->filterByState($request->input('state'))
                ->filterByName($request->input('search'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error in sorting,', 400, $e->getMessage());
                }
            }
            $perPage = $request->input('row_num');
            $positions = $query->paginate($perPage);
            if ($positions->isEmpty()) {
                return ApiResponse::error("There're not registered note types.", 200);
            }
            $collection = PositionResource::collection($positions);
            $responseData = $collection->response()->getData(true);
            
            return ApiResponse::success('Positions found.', 200, PositionResource::collection($responseData));
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error ocurred.', 500, $e->getMessage());
        }
    }

    public function store(PositionRequest $request)
    {
        try {
            DB::beginTransaction();
            $position = Position::create($request->validated());
            DB::commit();
            return ApiResponse::success('Position created sucessfully.', 201, $position);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while registering the position.', 500, $e->getMessage());
        }
    }


    public function show(Position $position)
    {
        try {
            return ApiResponse::success('Position found.', 200, PositionResource::make($position));
        } catch(\Exception $e){
            return ApiResponse::error('An error unexpected.', 500, $e->getMessage());
        }
    }

    public function update(PositionRequest $request, Position $position) {
        try {
            DB::beginTransaction();
            $position->update($request->validated());
            DB::commit();
            return ApiResponse::success('Position updated successfully.', 200, $position);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while updating the position.', 500, $e->getMessage());
        }
    }

}
