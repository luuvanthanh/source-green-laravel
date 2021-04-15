<?php
namespace GGPHP\Fingerprint\Services;

class UserFingerprint
{
    /**
     * Add employee to work schedule
     * @param $attributes
     * @return bool
     */
    public static function addOrUpdate($employee, $attributes)
    {
        // find or create role admin
        return $employee->fingerprints()->updateOrCreate(
            ['EmployeeId' => $employee->id, 'finger_index' => $attributes['finger_index']],
            $attributes
        );
    }

    /**
     * Remove employee from work schedule
     * @param $attributes
     * @return bool
     */
    public static function remove($employee, $fingerprintId)
    {
        return $employee->fingerprints()->delete($fingerprintId);
    }
}
