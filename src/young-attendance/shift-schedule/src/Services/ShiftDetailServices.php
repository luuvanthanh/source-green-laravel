<?php
namespace GGPHP\YoungAttendance\ShiftSchedule\Services;

use GGPHP\YoungAttendance\ShiftSchedule\Models\ShiftDetail;

class ShiftDetailServices
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function add($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['ShiftId'] = $id;
            $shiftDetail = ShiftDetail::create($value);
        }
        return true;
    }

    /**
     * @param $attributes
     * @return bool
     */
    public static function update($id, $attributes)
    {
        ShiftDetail::where('ShiftId', $id)->delete();
        foreach ($attributes as $value) {
            $value['ShiftId'] = $id;
            $shiftDetail = ShiftDetail::create($value);
        }
        return true;
    }
}
