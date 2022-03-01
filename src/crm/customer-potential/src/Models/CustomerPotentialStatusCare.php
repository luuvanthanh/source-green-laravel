<?php

namespace GGPHP\Crm\CustomerPotential\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\StatusParentPotential;

class CustomerPotentialStatusCare extends UuidModel
{
    protected $table = 'customer_potential_status_cares';

    protected $fillable = [
        'user_update_id', 'user_update_info', 'status_parent_potential_id', 'customer_potential_id', 'status_hard'
    ];

    public function statusParentPotential()
    {
        return $this->belongsTo(StatusParentPotential::class);
    }

    public function customerPotential()
    {
        return $this->belongsTo(CustomerPotential::class);
    }
}
