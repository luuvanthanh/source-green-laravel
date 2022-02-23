<?php

namespace GGPHP\Crm\CustomerLead\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\Tag;

class CustomerTag extends UuidModel
{
    protected $table = 'customer_tags';

    public $incrementing = false;

    public $fillable = [
        'tag_id', 'customer_lead_id'
    ];

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }
}
