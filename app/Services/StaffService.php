<?php

namespace App\Services;

use App\Models\Staff;
// use App\Notifications\NewUserNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StaffService {
    public function createStaff(array $data): Staff
    {   
        DB::beginTransaction();
        try {
            if (isset($data['complement']) && !empty($data['complement'])){
                if (isset($data['identity_card'])) {
                    $data['identity_card'].= '-'.$data['complement'];
                }
                unset($data['complement']);
            }
            $staff = Staff::create($data);
            
            // $user->notify(new NewUserNotification());
            DB::commit();
            return $staff;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateStaff(Staff $staff, array $data): Staff
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

            $staff->update($data);

            DB::commit();
            return $staff;
        }catch(\Exception $e){
            DB::rollBack();
            throw $e;
        }
    }


}
