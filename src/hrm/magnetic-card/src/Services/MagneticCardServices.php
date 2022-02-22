<?php
namespace GGPHP\MagneticCard\Services;

class MagneticCardServices
{
    /**
     * Add user to work schedule
     * @param $attributes
     * @return bool
     */
    public static function addOrUpdate($user, $attributes)
    {
        // find or create role admin
        $card = $user->magneticCards()->where(['EmployeeId' => $user->Id, 'MagneticCardPatch' => $attributes['magneticCardPatch']])->first();

        if ($card || count($user->magneticCards) > 0) {
            return;
        }

        return $user->magneticCards()->create($attributes);
    }
}
