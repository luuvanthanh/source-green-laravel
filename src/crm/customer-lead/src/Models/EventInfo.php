<?php

namespace GGPHP\Crm\CustomerLead\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\CategoryEvent;
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
        'name', 'date', 'location', 'status', 'result', 'customer_lead_id', 'time', 'description', 'category_event_id'
    ];

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }

    public function categoryEvent()
    {
        return $this->belongsTo(CategoryEvent::class);
    }
}
