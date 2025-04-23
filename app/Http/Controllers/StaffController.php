<?php

namespace App\Http\Controllers;

use App\Http\Requests\StaffRequest;
use App\Http\Requests\FilterRequest;
use App\Http\Resources\StaffResource;
use App\Http\Responses\ApiResponse;
use App\Models\Staff;
use Illuminate\Http\Request;
use App\Services\StaffService;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use PHPUnit\Event\Application\Started;

class StaffController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW STAFF', only: ['index', 'show']),
            // new Middleware('permission:REGISTER STAFF', only: ['store']),
            new Middleware('permission:UPDATE STAFF', only: ['update'])
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = Staff::query();
            $query->filterByState($request->input('state'))
                ->filterByOffice($request->input('office'))
                ->filterByEmail($request->input('email'))
                ->filterByIdentityCard($request->input('identity_card'))
                ->filterByIssuedBy($request->input('issued_by'))
                ->filterByName($request->input('search'))
                ->filterByOfficeName($request->input('office_name'))
                ->filterByPlaceName($request->input('place_name'))
                ->filterByStateName($request->input('state_name'))
                ->filterByPositionName($request->input('position_name'))

                ->filterByOfficeInitials($request->input('office_initials'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error in sorting', 400, $e->getMessage());
                }
            }

            $perPage = $request->input('row_num');
            $staff = $query->paginate($perPage);

            if ($staff->isEmpty()) {
                return ApiResponse::error("There're not registered staff.", 200);
            }

            $collection = StaffResource::collection($staff);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Staff found', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function store(StaffRequest $request, StaffService $service)
    {
        try {
            if (auth()->check() && (!auth()->user()->can('REGISTER STAFF'))) {
                return ApiResponse::error('This action is unauthorized.', 403);
            }
            $data = $request->validated();
            $staff = $service->createStaff($data);
            return ApiResponse::success('Staff registered successfully.', 201, $staff);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while registering the staff.', 500, $e->getMessage());
        }
    }

    public function show(Staff $staff)
    {
        try {
            return ApiResponse::success('Staff found.', 200, StaffResource::make($staff));
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function update(StaffRequest $request, Staff $staff, StaffService $service)
    {
        try {
            $data = $request->validated();
            $updatedStaff = $service->updateStaff($staff, $data);
            return ApiResponse::success('Staff updated succesfully.', 200, $updatedStaff);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            return ApiResponse::error('The Identity Card provided is already in use.', 422); // Código de estado 422 (Unprocessable Entity) es apropiado para errores de validación
        } catch (\Exception $e) {
            return ApiResponse::error('An error occurred while updating the user.', 500, $e->getMessage());
        }
    }
}
