<?php

namespace App\Http\Middleware;

use App\Http\Responses\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckModulePermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $action, $module): Response
    {
        if (!$request->user()->hasPermissionTo($action)) {
            return ApiResponse::error('Unauthorized', 403);
        }

        $moduleAccessConfig = [
            'users'   => ['ADMINISTRATOR'],
            'states'  => ['ADMINISTRATOR', 'USER'],
            'offices' => ['ADMINISTRATOR', 'USER'],
        ];
        $userRoles = $request->user()->getRoleNames()->map(fn($role) => strtoupper($role))->toArray();

        $allowedRoles = $moduleAccessConfig[$module] ?? [];
        $hasModuleAccess = count(array_intersect($userRoles, $allowedRoles)) > 0;
        
        if (!$hasModuleAccess) {
            return ApiResponse::error("You do not have access to this module: {$module}", 403);

        }

        return $next($request);
    }
}
