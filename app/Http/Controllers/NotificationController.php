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
            return ApiResponse::success('Notifications found', 200, $notifications);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function markAsRead(Request $request, $notificationId)
    {
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
