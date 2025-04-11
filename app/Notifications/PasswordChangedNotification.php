<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordChangedNotification extends Notification
{
    use Queueable;
    protected $userWhoChangedPassword;

    public function __construct(User $user)
    {
        $this->userWhoChangedPassword = $user;
    }
    
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable) {
        return [
            'message' => "User {$this->userWhoChangedPassword->first_name} {$this->userWhoChangedPassword->last_name} has changed his password.",
            'user_id' => $this->userWhoChangedPassword->id
        ];  
    }
    public function toArray(object $notifiable): array
    {
        return [];
    }
}
