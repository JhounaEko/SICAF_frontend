<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\NewUserNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService {
    public function createUser(array $data): User
    {   
        DB::beginTransaction();
        try {
            if (isset($data['complement']) && !empty($data['complement'])){
                if (isset($data['identity_card'])) {
                    $data['identity_card'].= '-'.$data['complement'];
                }
                unset($data['complement']);
            }
            $user = User::create($data);

            if (isset($data['roles'])){
                $user->assignRole($data['roles']);
            }
            
            $user->notify(new NewUserNotification());
            DB::commit();
            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateUser(User $user, array $data): User
    {
        DB::beginTransaction();
        try{
            if (isset($data['complement']) && !empty($data['complement'])){
                if (isset($data['identity_card'])) {
                    $data['identity_card'].= '-'.$data['complement'];
                }
                unset($data['complement']);
            }

            $data =  array_filter($data,  function($value){
                return $value !== "";
            });

            $user->update($data);

            if(isset($data['roles'])){
                $user->syncRoles($data['roles']);
            }

            DB::commit();
            return $user;
        }catch(\Exception $e){
            DB::rollBack();
            throw $e;
        }
    }

    public function updateUserPassword(User $user, string $newPassword): User
    {
        DB::beginTransaction();
        try {
            $user->password = Hash::make($newPassword);
            $user->decrement('password_change_count');
            $user->save();
            DB::commit();
            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function resetPasswordChangeLimit(User $user, int $limit = 3): User{
        DB::beginTransaction();
        try {
            $user->password_change_count = $limit;
            $user->save();
            DB::commit();
            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
