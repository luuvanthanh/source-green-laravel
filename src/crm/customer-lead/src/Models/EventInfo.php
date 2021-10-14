<?php

namespace GGPHP\Crm\CustomerLead\Models;


use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventInfo extends UuidModel
{
    use SoftDeletes;

    const STATUS = [
        'COMING_EVENTS' => 0,
        'PAST_EVENTS' => 1
    ];

    protected $table = 'event_infos';

    public $incrementing = false;

    public $fillable = [
        'name', 'date', 'location', 'status', 'result', 'customer_lead_id', 'time'
    ];

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }
}
