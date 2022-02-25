<?php

namespace GGPHP\Crm\CustomerLead\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\StatusParentLead;

class StatusLead extends UuidModel
{
    protected $table = 'status_lead';

    protected $fillable = [
        'user_update_id', 'user_update_info', 'status', 'customer_lead_id'
    ];

    const STATUS_LEAD = [
        'LEAD_NEW' => 0,
        'POTENTIAL' => 1,
        'NOT_POTENTIAL' => 2
    ];

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }
}
