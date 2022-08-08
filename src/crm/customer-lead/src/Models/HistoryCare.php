<?php

namespace GGPHP\Crm\CustomerLead\Models;

use GGPHP\Core\Models\UuidModel;

class HistoryCare extends UuidModel
{
    protected $table = 'history_cares';

    protected $fillable = [
        'customer_lead_id', 'quantity_care', 'status', 'date', 'hours', 'content_call', 'result_call', 'history_interactive', 'offline'
    ];

    const STATUS = [
        'LEAD_NEW' => 0,
        'POTENTIAL' => 1,
        'NOT_POTENTIAL' => 2
    ];

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }
}
