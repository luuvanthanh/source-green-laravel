<?php
namespace GGPHP\AddSubTime\Services;

use GGPHP\AddSubTime\Models\AddSubTimeDetail;

class AddSubTimeServices
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function add($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['AddSubTimeId'] = $id;
            $shiftDetail = AddSubTimeDetail::create($value);
        }

        return true;
    }
}
