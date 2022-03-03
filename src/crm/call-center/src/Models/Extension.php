<?php

namespace GGPHP\Crm\CallCenter\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Employee\Models\Employee;

class Extension extends UuidModel
{
    protected $table = 'extensions';

    protected  $fillable = ['password', 'domain', 'id_cmc', 'phone_id_cmc', 'state', 'user_id_cmc', 'phone_number', 'caller'];

    public function employeeByExtension()
    {
        return $this->hasMany(EmployeeExtension::class);
    }

    public function employee()
    {
        return $this->belongsToMany(Employee::class, EmployeeExtension::class);
    }
}
