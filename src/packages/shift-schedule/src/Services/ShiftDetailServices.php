<?php
namespace GGPHP\ShiftSchedule\Services;

use GGPHP\ShiftSchedule\Models\ShiftDetail;

class ShiftDetailServices
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function add($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['shift_id'] = $id;
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
        ShiftDetail::where('shift_id', $id)->delete();
        foreach ($attributes as $value) {
            $value['shift_id'] = $id;
            $shiftDetail = ShiftDetail::create($value);
        }
        return true;
    }
}
