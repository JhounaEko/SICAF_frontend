<?php

namespace App\Http\Controllers;

use App\Http\Requests\EnterpriseRequest;
use App\Http\Requests\FilterRequest;
use App\Http\Resources\EnterpriseResource;
use App\Http\Responses\ApiResponse;
use App\Models\Enterprise;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class EnterpriseController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW ENTERPRISES', only: ['index', 'show']),
            new Middleware('permission:REGISTER ENTERPRISES', only: ['store']),
            new Middleware('permission:UPDATE ENTERPRISES', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = Enterprise::query();
            $query->filterByState($request->input('state'))
                ->filterByEnterpriseRubric($request->input('enterprise_rubric'))
                ->filterByNameOrInitialsOrAddress($request->input('search'))
                ->filterByBranchName($request->input('branch_name'))
                ->filterByCountry($request->input('country'))
                ->filterByPhoneNumber($request->input('phone_number'))
                ->filterByEmail($request->input('email'))
                ->filterByContactOrRepresentativeName($request->input('representative'))
                ->filterByStateName($request->input('state_name'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error in sorting', 400, $e->getMessage());
                }
            }

            $perPage = $request->input('row_num');
            $enterprises = $query->paginate($perPage);

            if ($enterprises->isEmpty()) {
                return ApiResponse::error("There're not registered enterprises.", 200);
            }

            $collection = EnterpriseResource::collection($enterprises);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Enterprises found.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function store(EnterpriseRequest $request)
    {
        try {
            DB::beginTransaction();
            $enterprise = Enterprise::create($request->validated());
            DB::commit();
            return ApiResponse::success('Enterprise registered successfully.', 201, $enterprise);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while registering the enterprise.', 500, $e->getMessage());
        }
    }

    public function show(Enterprise $enterprise)
    {
        try {
            return ApiResponse::success('Enterprise found.', 200, EnterpriseResource::make($enterprise));
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function update(EnterpriseRequest $request, Enterprise $enterprise)
    {
        try {
            DB::beginTransaction();
            $enterprise->update($request->validated());
            DB::commit();
            return ApiResponse::success('Enterprise updated succesfully.', 200, $enterprise);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }
}
