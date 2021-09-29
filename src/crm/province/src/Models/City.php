<?php

namespace GGPHP\Crm\Province\Models;

use GGPHP\ConfigShippingFee\Models\ConfigShippingFee;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;

class City extends UuidModel
{
    protected $table = 'citys';

    protected $fillable = [
        'name'
    ];

    public function district()
    {
        return $this->hasMany(District::class);
    }

    public function customerLead()
    {
        return $this->hasMany(CustomerLead::class);
    }
}
