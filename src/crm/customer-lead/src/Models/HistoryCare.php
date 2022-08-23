<?php

namespace GGPHP\Crm\CustomerLead\Models;

use GGPHP\Core\Models\UuidModel;

class HistoryCare extends UuidModel
{
    protected $table = 'history_cares';

    protected $fillable = [
        'customer_lead_id', 'quantity_care', 'status', 'date', 'hours', 'content', 'result', 'history_interactive', 'offline', 'category'
    ];

    const STATUS = [
        'LEAD_NEW' => 0,
        'POTENTIAL' => 1,
        'NOT_POTENTIAL' => 2
    ];

    const CATEGORY = [
        'PHONE' => 1,
        'EMAIL' => 2,
        'FACEBOOK' => 3
    ];

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }
}
