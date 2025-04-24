<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\FundingOrganizationRequest;
use App\Http\Resources\FundingOrganizationResource;
use App\Http\Responses\ApiResponse;
use App\Models\FundingOrganization;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class FundingOrganizationController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW FUNDING ORGANIZATIONS', only: ['index', 'show']),
            new Middleware('permission:REGISTER FUNDING ORGANIZATIONS', only: ['store']),
            new Middleware('permission:UPDATE FUNDING ORGANIZATIONS', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = FundingOrganization::query();
            $query->filterByState($request->input('state'))
                ->filterByDescriptionOrAbbreviation($request->input('search'))
                ->filterByCode($request->input('code'))
                ->filterByYear($request->input('year'))
                ->filterByStateName($request->input('state_name'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error al ordenar', 400, $e->getMessage());
                }
            }

            $perPage = $request->input('row_num');
            $funding_organizations = $query->paginate($perPage);

            if ($funding_organizations->isEmpty()) {
                return ApiResponse::error('No hay organismos financiadores registrados.', 200);
            }

            $collection = FundingOrganizationResource::collection($funding_organizations);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Organismos financiadores encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(FundingOrganizationRequest $request)
    {
        try {
            DB::beginTransaction();
            $funding_organization = FundingOrganization::create($request->validated());
            DB::commit();
            return ApiResponse::success('Organismo financiador registrado exitosamente.', 201, $funding_organization);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al registrar el organismo financiador.', 500, $e->getMessage());
        }
    }

    
    public function show(FundingOrganization $fundingOrganization)
    {
        try {
            return ApiResponse::success('Organismo financiador encontrado.', 200, FundingOrganizationResource::make($fundingOrganization));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(FundingOrganizationRequest $request, FundingOrganization $fundingOrganization)
    {
        try {
            DB::beginTransaction();
            $fundingOrganization->update($request->validated());
            DB::commit();
            return ApiResponse::success('Organismo financiador actualizado exitosamente.', 200, $fundingOrganization);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al actualizar el organismo financiador.', 500, $e->getMessage());
        }
    }
}
