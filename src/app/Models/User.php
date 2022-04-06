<?php

namespace App\Models;

use GGPHP\Users\Models\User as CoreUser;

class User extends CoreUser
{

    public function fingerprints()
    {
        return $this->hasMany(\GGPHP\Fingerprint\Models\Fingerprint::class, 'EmployeeId');
    }
    public function attendences()
    {
        return $this->hasMany(\GGPHP\Timekeeping\Models\Timekeeping::class, 'EmployeeId');
    }
    public function bios()
    {
        return $this->hasMany(\GGPHP\Bio\Models\Bio::class, 'EmployeeId');
    }
    /**
     * Define relations magneticCards
     */
    public function magneticCards()
    {
        return $this->hasMany(\GGPHP\MagneticCard\Models\MagneticCard::class, 'EmployeeId')->withTrashed();
    }
}
