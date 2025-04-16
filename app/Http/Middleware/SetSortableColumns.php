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
        }else if ($request->routeIs('v1.audits.index')){
            $sortableColumns = ['id', 'user_type', 'user_id', 'event', 'auditable_type', 'auditable_id', 'old_values', 'new_values', 'url', 'ip_address', 'user_agent', 'tags', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.historic_exchange_rates.index')){
            $sortableColumns = ['id', 'exchange_rate', 'exchange_rate_date', 'ufv', 'state_id', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.historic_changes.index')){
            $sortableColumns = ['id', 'ufv', 'date', 'state_id', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.correlatives.index')){
            $sortableColumns = ['id', 'description', 'limit_date', 'current_number', 'state_id', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.historic_note_details.index')){
            $sortableColumns = ['id', 'note_id', 'income_note_id', 'payment_voucher', 'expense_voucher', 'voucher', 'fdm_amount', 'fdm_date', 'state_id', 'created_at', 'updated_at'];
        }else if ($request->routeIs('v1.historic_increments.index')){
            $sortableColumns = ['id', 'item_id', 'date', 'description', 'is_active', 'state_id', 'created_at', 'updated_at'];
        }
        

        $request->merge(['sortable_columns' => $sortableColumns]);
        return $next($request);
    }
}
