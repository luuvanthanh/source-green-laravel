<?php
namespace GGPHP\Timekeeping\Services;

class UserAttendence
{
    /**
     * Add employee to work schedule
     * @param $attributes
     * @return bool
     */
    public static function attend($employee, $attributes)
    {
        // find or create role admin
        return $employee->attendences()->create($attributes);
    }
}
