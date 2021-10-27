<?php

namespace GGPHP\WorkOnline\Services;

use GGPHP\WorkOnline\Models\WorkOnlineDetail;

class WorkOnlineDetailServices
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function add($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['WorkOnlineId'] = $id;
            $shiftDetail = WorkOnlineDetail::create($value);
        }

        return true;
    }
}
