<?php
namespace GGPHP\Dismissed\Services;

use GGPHP\Dismissed\Models\DismissedDetail;

class DismissedDetailServices
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function add($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['dismissed_id'] = $id;
            $shiftDetail = DismissedDetail::create($value);
        }

        return true;
    }
}
