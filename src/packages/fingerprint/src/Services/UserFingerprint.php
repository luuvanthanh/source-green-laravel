<?php
namespace GGPHP\Fingerprint\Services;

use GGPHP\Fingerprint\Models\Fingerprint as Model;

class UserFingerprint
{
    /**
    * Add user to work schedule
    * @param $attributes
    * @return bool
    */
    public static function addOrUpdate($user, $attributes)
    {
        // find or create role admin
        return $user->fingerprints()->updateOrCreate(
            ['user_id' => $user->id, 'finger_index' => $attributes['finger_index']],
            $attributes
        );
    }

    /**
    * Remove user from work schedule
    * @param $attributes
    * @return bool
    */
    public static function remove($user, $fingerprintId)
    {
        return $user->fingerprints()->delete($fingerprintId);
    }
}
