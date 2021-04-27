<?php
namespace ZK\Services;

class WorkOnDevice
{
    /**
     * Add employee to work schedule
     * @param $attributes
     * @return bool
     */
    public static function addUserToDevices($employee, $devices)
    {
        return dispatch(new \ZK\Jobs\SyncUserToDevice($employee, $devices));
    }

    /**
     * Remove employee from work schedule
     * @param $attributes
     * @return bool
     */
    public static function removeUserOnDevice($employee, $device)
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
