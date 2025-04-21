<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\ItemGroupRequest;
use App\Http\Resources\ItemGroupResource;
use App\Http\Responses\ApiResponse;
use App\Models\ItemGroup;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class ItemGroupController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW ITEM GROUPS', only: ['index', 'show']),
            new Middleware('permission:REGISTER ITEM GROUPS', only: ['store']),
            new Middleware('permission:UPDATE ITEM GROUPS', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = ItemGroup::query();
            $query->filterByState($request->input('state'))
                ->filterByBudgetRubric($request->input('budget_rubric'))
                ->filterByDescriptionsOrMaterial($request->input('search'))
                ->filterByItemGroupType($request->input('item_group_type'))
                ->filterByAlphanumericCode($request->input('alphanumeric_code'))
                ->filterByType($request->input('type'))
                ->filterByIsIntangible($request->input('is_intangible'))
                ->filterByUsefulMonths($request->input('useful_months'))
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
            $item_groups = $query->paginate($perPage);

            if ($item_groups->isEmpty()) {
                return ApiResponse::error("There're not registered item groups.", 200);
            }

            $collection = ItemGroupResource::collection($item_groups);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Item groups found.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function store(ItemGroupRequest $request)
    {
        try {
            DB::beginTransaction();
            $item_group = ItemGroup::create($request->validated());
            DB::commit();
            return ApiResponse::success('Item group registered successfully.', 201, $item_group);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while registering the item group.', 500, $e->getMessage());
        }
    }

    public function show(ItemGroup $itemGroup)
    {
        try {
            return ApiResponse::success('Item group found.', 200, ItemGroupResource::make($itemGroup));
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function update(ItemGroupRequest $request, ItemGroup $itemGroup)
    {
        try {
            DB::beginTransaction();
            $itemGroup->update($request->validated());
            DB::commit();
            return ApiResponse::success('Item group updated succesfully.', 200, $itemGroup);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }
}
