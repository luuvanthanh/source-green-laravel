<?php

namespace GGPHP\Crm\CustomerLead\Models;


use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventInfo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'event_infos';

    public $incrementing = false;

    public $fillable = [
        'name', 'date', 'location', 'status', 'result', 'customer_lead_id'
    ];
}
