<?php

namespace App\Http\Controllers;

use App\Models\State;
use App\Http\Requests\StateRequest;
use App\Http\Resources\StateResource;
use App\Http\Responses\ApiResponse;

class StateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $states = State::all();
            return ApiResponse::success('States found.', 200, StateResource::collection($states));
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
    public function show(State $state , $id)
    {
        try {
            if (!is_numeric($id)) {
                return ApiResponse::error('Id is not valida format.', 400);
            }
            $state = State::find($id);
            if (!$state) {
                return ApiResponse::error('State not found.', 200);
            }
            return ApiResponse::success('State found', 200, $state);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected.', 500, $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StateRequest $request, State $state)
    {
        try {
            
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected.', 500, $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(State $state)
    {
        //
    }
}
