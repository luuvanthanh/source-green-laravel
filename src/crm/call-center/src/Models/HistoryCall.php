<?php

namespace GGPHP\Crm\CallCenter\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;

class HistoryCall extends UuidModel
{
    protected $table = 'history_calls';

    protected  $fillable = [
        'customer_lead_id', 'call_id_sub', 'call_status', 'record_link', 'direction', 'content',
        'result', 'refuse', 'phone', 'switchboard', 'employee_id', 'manager_call_id', 'call_id_parent', 'call_id_main'
    ];

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }

    public function managerCall()
    {
        return $this->belongsTo(ManagerCall::class);
    }
}
