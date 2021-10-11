<?php

namespace GGPHP\Crm\CustomerPotentail\Models;


use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\Tag;
use GGPHP\Crm\CustomerPotentail\Models\CustomerPotentail;

class CustomerPotentailTag extends UuidModel
{
    protected $table = 'customer_potentail_tags';

    public $incrementing = false;

    public $fillable = [
        'tag_id', 'customer_potentail_id'
    ];

    public function customerPotentail()
    {
        return $this->belongsTo(CustomerPotentail::class);
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }
}
