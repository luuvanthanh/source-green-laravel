<?php

namespace App\Models;

use GGPHP\Users\Models\User as CoreUser;

class User extends CoreUser
{
    public function fingerprints()
    {
        return $this->hasMany(\GGPHP\Fingerprint\Models\Fingerprint::class);
    }
    public function attendences()
    {
        return $this->hasMany(\GGPHP\Timekeeping\Models\Timekeeping::class);
    }
}