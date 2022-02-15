<?php

namespace GGPHP\OtherDeclaration\Services;

use GGPHP\OtherDeclaration\Models\ChangeContractParameter;
use GGPHP\OtherDeclaration\Models\OtherDeclarationDetail;

class OtherDeclarationServices
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function addDetail($id, $attributes)
    {
        foreach ($attributes as $value) {

            $value['OtherDeclarationId'] = $id;
            $value['detail'] = json_encode($value['detail']);
            OtherDeclarationDetail::create($value);
        }

        return true;
    }

    /**
     * @param $attributes
     * @return bool
     */
    public static function addChangeContract($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['OtherDeclarationId'] = $id;
            $value['detail'] = json_encode($value['detail']);
            ChangeContractParameter::create($value);
        }

        return true;
    }
}
