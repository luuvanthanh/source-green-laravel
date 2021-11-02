<?php

namespace GGPHP\Crm\Category\Models;

use GGPHP\Core\Models\UuidModel;

class Branch extends UuidModel
{
    protected $table = 'branches';

    protected $fillable = [
        'code', 'name', 'address', 'phone_number', 'branch_id_hrm'
    ];
}
