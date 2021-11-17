<?php

namespace GGPHP\RolePermission\Models;

use Spatie\Permission\Models\Role as OriginalRole;

class Role extends OriginalRole
{
    public $guard_name = 'api';
}
