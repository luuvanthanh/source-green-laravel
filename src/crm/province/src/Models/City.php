<?php

namespace GGPHP\Crm\Province\Models;

use GGPHP\ConfigShippingFee\Models\ConfigShippingFee;
use GGPHP\Core\Models\UuidModel;

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
}
