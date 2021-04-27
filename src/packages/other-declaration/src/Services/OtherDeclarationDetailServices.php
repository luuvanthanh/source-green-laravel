<?php
namespace GGPHP\OtherDeclaration\Services;

use GGPHP\OtherDeclaration\Models\OtherDeclarationDetail;

class OtherDeclarationDetailServices
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function add($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['OtherDeclarationId'] = $id;
            $shiftDetail = OtherDeclarationDetail::create($value);
        }

        return true;
    }
}
