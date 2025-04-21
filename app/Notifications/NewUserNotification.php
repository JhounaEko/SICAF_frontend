<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewUserNotification extends Notification
{
    use Queueable;
    public function __construct()
    {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => 'Se recomienda que actualice su contraseña por razones de seguridad.',
        ];
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }
}
