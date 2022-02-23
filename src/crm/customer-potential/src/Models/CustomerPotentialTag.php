<?php

namespace GGPHP\Crm\CustomerPotential\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\Tag;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;

class CustomerPotentialTag extends UuidModel
{
    protected $table = 'customer_potential_tags';

    public $incrementing = false;

    public $fillable = [
        'tag_id', 'customer_potential_id'
    ];

    public function customerPotential()
    {
        return $this->belongsTo(CustomerPotential::class);
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }
}
