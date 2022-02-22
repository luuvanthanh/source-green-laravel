<?php
namespace GGPHP\BusinessCard\Services;

use GGPHP\BusinessCard\Models\BusinessCardDetail;

class BusinessCardDetailServices
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function add($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['BusinessCardId'] = $id;
            $shiftDetail = BusinessCardDetail::create($value);
        }

        return true;
    }
}
