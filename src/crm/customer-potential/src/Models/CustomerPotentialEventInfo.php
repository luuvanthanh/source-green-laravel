<?php

namespace GGPHP\Crm\CustomerPotential\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerPotentialEventInfo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'customer_potential_event_infos';

    public $incrementing = false;

    public $fillable = [
        'name', 'date', 'location', 'status', 'result', 'customer_potential_id'
    ];

    public function customerPotential()
    {
        return $this->belongsTo(CustomerPotential::class);
    }
}
