<?php

namespace GGPHP\Crm\Employee\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends UuidModel
{
    use SoftDeletes;

    protected $table = 'employees';

    protected $fillable = [
        'full_name', 'employee_id_hrm'
    ];

    public function customerLead()
    {
        return $this->hasMany(CustomerLead::class);
    }

    public function CustomerPotential()
    {
        return $this->hasMany(CustomerPotential::class);
    }
}
