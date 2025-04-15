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
            if ($notifications->isEmpty()) {
                return ApiResponse::success('No unread notifications found.', 200, $notifications);
            }
            return ApiResponse::success('Unread notifications found', 200, $notifications);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function markAsRead(Request $request, $notificationId)
    {
        $validator = Validator::make(['notificationId' => $notificationId], [
            'notificationId' => 'required|uuid',
        ]);
    
        if ($validator->fails()) {
            return ApiResponse::error('Invalid notification ID provided.', 422, $validator->errors());
        }
        try {
            $user = $request->user();
            $notification = $user->notifications()->where('id', $notificationId)->first();
            if (!$notification) {
                return ApiResponse::error('Notification not found', 404);
            }
            $notification->markAsRead();
            return ApiResponse::success('Notification marked as read.', 200, $notification);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function markAllAsRead(Request $request)
    {
        try {
            $user = $request->user();
            $user->unreadNotifications->markAsRead();
            return ApiResponse::success('All notifications marked as read', 200);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }
}
