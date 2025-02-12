<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Models\State;
use App\Http\Requests\StateRequest;
use App\Http\Resources\StateResource;
use App\Http\Responses\ApiResponse;

class StateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(FilterRequest $request)
    {
        try {
            $query = State::query();

            $query->filterByDescriptionOrName($request->input('search'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error in sorting.', 400, $e->getMessage());
                }
            }

            $states = $query->paginate(10);

            if ($states->isEmpty()) {
                return ApiResponse::error("There're not registered states.", 200);
            }
            
            $collection = StateResource::collection($states);
            $responseData = $collection->response()->getData(true);


            return ApiResponse::success('States found.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error ocurred.', 500, $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StateRequest $request)
    {
        try {
            $state = State::create($request->validated());
            return ApiResponse::success('State created sucessfully', 201, $state);
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error ocurred.', 500, $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            if (!is_numeric($id)) {
                return ApiResponse::error('Invalid ID format.', 400);
            }
            $state = State::find($id);
            if (!$state) {
                return ApiResponse::error('State not found.', 200);
            }
            return ApiResponse::success('State found', 200, StateResource::make($state));
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected.', 500, $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StateRequest $request,  $id)
    {
        try {
            if (!is_numeric($id)) {
                return ApiResponse::error('Invalid ID format.', 400);
            }
            $state = State::find($id);
            if (!$state) {
                return ApiResponse::error('State not found.', 200);
            }
            $state->update($request->validated());
            return ApiResponse::success('State updated succesfully.', 200, $state);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected.', 500, $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */

}
