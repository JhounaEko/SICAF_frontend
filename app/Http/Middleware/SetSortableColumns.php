<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetSortableColumns
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $sortableColumns = [];
        if ($request->routeIs('v1.states.index')) {
            $sortableColumns = ['id', 'name', 'description', 'code', 'color', 'order', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.offices.index')) {
            $sortableColumns = ['id', 'name', 'initials', 'parent', 'level', 'state_id', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.users.index')){
            $sortableColumns = ['id', 'first_name', 'last_name', 'phone_number', 'identity_card', 'issued_by', 'username', 'email', 'office_id', 'office_name', 'office_initials', 'state_id', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.permissions.index')) {
            $sortableColumns = ['id', 'name', 'guard', 'state_id', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.roles.index')) {
            $sortableColumns = ['id', 'name', 'guard', 'state_id', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.employees.index')) {
            $sortableColumns = ['id', 'first_name', 'last_name', 'phone_number', 'position', 'office_id', 'state_id', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.menus.index')){
            $sortableColumns = ['id', 'label', 'route', 'parent', 'icon', 'state_id', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.motives.index')){
            $sortableColumns = ['id', 'name', 'description', 'state_id', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.note_types.index')){
            $sortableColumns = ['id', 'name', 'description', 'state_id', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.increase_types.index')){
            $sortableColumns = ['id', 'name', 'description', 'state_id', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.positions.index')){
            $sortableColumns = ['id', 'name', 'description', 'state_id', 'created_at', 'updated_at'];
        }
        

        $request->merge(['sortable_columns' => $sortableColumns]);
        return $next($request);
    }
}
