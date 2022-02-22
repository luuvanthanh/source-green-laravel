<?php
namespace GGPHP\Absent\Services;

use GGPHP\Absent\Models\AbsentDetail;

class AbsentDetailServices
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function add($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['AbsentId'] = $id;
            $shiftDetail = AbsentDetail::create($value);
        }

        return true;
    }
}
