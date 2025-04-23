<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $notifications = $user->unreadNotifications;
<<<<<<< HEAD
            return ApiResponse::success('Notificaciones encontradas.', 200, $notifications);
=======
            if ($notifications->isEmpty()) {
                return ApiResponse::success('No unread notifications found.', 200, $notifications);
            }
            return ApiResponse::success('Unread notifications found', 200, $notifications);
>>>>>>> 9ba86a3afbf92d7b37b3fc89b2a3ca852a226ad5
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function markAsRead(Request $request, $notificationId)
    {
        $validator = Validator::make(['notificationId' => $notificationId], [
            'notificationId' => 'required|uuid',
        ]);
    
        if ($validator->fails()) {
            return ApiResponse::error('ID de notificación proporcionado no válido.', 422, $validator->errors());
        }
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
