<?php
namespace GGPHP\Transfer\Services;

use GGPHP\Transfer\Models\TransferDetail;

class TransferDetailServices
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function add($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['TransferId'] = $id;
            $shiftDetail = TransferDetail::create($value);
        }

        return true;
    }
}
