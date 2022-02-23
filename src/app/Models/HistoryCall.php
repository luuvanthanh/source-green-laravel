<?php

namespace App\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use Illuminate\Database\Eloquent\Model;

class HistoryCall extends UuidModel
{
    protected $table = 'history_calls';

    protected  $fillable = ['customer_lead_id', 'call_sid', 'call_status', 'record_link', 'direction'];

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }
}
