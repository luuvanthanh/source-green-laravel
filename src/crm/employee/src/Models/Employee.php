<?php

namespace GGPHP\Crm\Employee\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CallCenter\Models\EmployeeExtension;
use GGPHP\Crm\CallCenter\Models\Extension;
use GGPHP\Crm\CallCenter\Models\ManagerCall;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends UuidModel
{
    use SoftDeletes;

    protected $table = 'employees';

    protected $fillable = [
        'full_name', 'employee_id_hrm', 'file_image'
    ];

    public function customerLead()
    {
        return $this->hasMany(CustomerLead::class);
    }

    public function CustomerPotential()
    {
        return $this->hasMany(CustomerPotential::class);
    }

    public function extension()
    {
        return $this->belongsToMany(Extension::class, EmployeeExtension::class);
    }

    public function branch()
    {
        return $this->hasMany(EmployeeExtension::class);
    }

    public function managerCall()
    {
        return $this->hasMany(ManagerCall::class);
    }
}
