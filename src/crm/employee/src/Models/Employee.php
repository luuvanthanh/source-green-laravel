<?php

namespace GGPHP\Crm\Employee\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends UuidModel
{
    use SoftDeletes;

    protected $table = 'employees';

    protected $fillable = [
        'full_name', 'employee_id_hrm'
    ];
}
