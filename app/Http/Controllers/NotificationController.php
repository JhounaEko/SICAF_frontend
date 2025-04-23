<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $notifications = $user->unreadNotifications;
            return ApiResponse::success('Notificaciones encontradas.', 200, $notifications);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function markAsRead(Request $request, $notificationId)
    {
        try {
            $user = $request->user();
            $notification = $user->notifications()->where('id', $notificationId)->first();
            if (!$notification) {
                return ApiResponse::error('Notificación no encontrada.', 404);
            }
            $notification->markAsRead();
            return ApiResponse::success('Notificación marcada como leída.', 200, $notification);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function markAllAsRead(Request $request)
    {
        try {
            $user = $request->user();
            $user->unreadNotifications->markAsRead();
            return ApiResponse::success('Todas las notificaciones fueron marcadas como leídas.', 200);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }
}
