<?php

namespace GGPHP\Crm\CallCenter\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;

class ManagerCall extends UuidModel
{
    protected $table = 'manager_calls';

    const STATUS = [
        'CALLYET' => 1,
        'CALLED' => 2,
    ];

    const CALLTIME = [
        'FIRST' => 1,
        'SECOND' => 2,
        'THIRD' => 3,
        'FOURTH' => 4,
        'FIVETH' => 5
    ];

    protected  $fillable = [
        'expected_date', 'receive_date', 'date_call', 'content',
        'before_time', 'call_times', 'customer_lead_id', 'status', 'employee_id'
    ];

    public function history()
    {
        return $this->hasMany(HistoryCall::class);
    }

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }

}
