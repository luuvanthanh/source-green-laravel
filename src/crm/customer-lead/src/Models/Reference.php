<?php

namespace GGPHP\Crm\CustomerLead\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\StatusParentLead;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reference extends UuidModel
{
    use SoftDeletes;

    protected $table = 'references';

    protected $fillable = [
        'full_name', 'birth_date', 'address', 'phone',
        'status_parent_lead_id', 'customer_lead_id'
    ];

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }

    public function statusParentLead()
    {
        return $this->belongsTo(StatusParentLead::class);
    }
}
