<?php
namespace GGPHP\Appoint\Services;

use GGPHP\Appoint\Models\AppointDetail;

class AppointDetailServices
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function add($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['appoint_id'] = $id;
            $shiftDetail = AppointDetail::create($value);
        }

        return true;
    }
}
