<?php
namespace ZK\Services;

class WorkOnDevice
{
    /**
    * Add user to work schedule
    * @param $attributes
    * @return bool
    */
    public static function addUserToDevices($user, $devices)
    {
        return dispatch(new \ZK\Jobs\SyncUserToDevice($user, $devices));
    }

    /**
    * Remove user from work schedule
    * @param $attributes
    * @return bool
    */
    public static function removeUserOnDevice($user, $device)
    {
        return true;
    }

    /**
    * Delete a fingerprint
    * @param $attributes
    * @return bool
    */
    public static function deleteFingerprint($fingerprint, $devices)
    {
        return dispatch(new \ZK\Jobs\DeleteFingerprintOnDevice($fingerprint, $devices));
    }

    /**
    * Delete a fingerprint
    * @param $attributes
    * @return bool
    */
    public static function upsertFingerprint($uid, $fingerprint, $devices)
    {
        return dispatch(new \ZK\Jobs\UpsertFingerprintOnDevice($uid, $fingerprints, $devices));
    }
}
