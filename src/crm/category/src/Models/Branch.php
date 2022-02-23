<?php

namespace GGPHP\Crm\Category\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;

class Branch extends UuidModel
{
    protected $table = 'branches';

    protected $fillable = [
        'code', 'name', 'address', 'phone_number', 'branch_id_hrm'
    ];

    public function customerLead()
    {
        return $this->hasMany(CustomerLead::class);
    }
}
