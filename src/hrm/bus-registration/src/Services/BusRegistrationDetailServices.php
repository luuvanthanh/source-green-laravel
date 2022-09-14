<?php

namespace GGPHP\BusRegistration\Services;

use GGPHP\BusRegistration\Models\BusRegistrationDetail;

class BusRegistrationDetailServices
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function add($id, $attributes)
    {
        foreach ($attributes as $value) {
            $value['BusRegistrationId'] = $id;
            $shiftDetail = BusRegistrationDetail::create($value);
        }

        return true;
    }
}
