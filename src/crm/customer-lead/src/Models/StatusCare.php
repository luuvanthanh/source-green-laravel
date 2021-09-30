<?php

namespace GGPHP\Crm\CustomerLead\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\StatusParentLead;

class StatusCare extends UuidModel
{
    protected $table = 'status_cares';

    protected $fillable = [
        'user_update_id', 'user_update_info', 'status_parent_lead_id', 'customer_lead_id'
    ];

    public function statusParentLead()
    {
        return $this->belongsTo(StatusParentLead::class);
    }

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }
}
