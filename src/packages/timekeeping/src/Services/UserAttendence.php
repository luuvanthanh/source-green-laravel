<?php
namespace GGPHP\Timekeeping\Services;

use GGPHP\Timekeeping\Models\Timekeeping as Model;

class UserAttendence
{
    /**
    * Add user to work schedule
    * @param $attributes
    * @return bool
    */
    public static function attend($user, $attributes)
    {
        // find or create role admin
        return $user->attendences()->create($attributes);
    }
}
