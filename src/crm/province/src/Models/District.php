<?php

namespace GGPHP\Crm\Province\Models;

use GGPHP\ConfigShippingFee\Models\ConfigShippingFeeDetail;
use GGPHP\Core\Models\UuidModel;

class District extends UuidModel
{
    protected $table = 'districts';

    protected $fillable = [
        'name', 'city_id'
    ];

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function townward()
    {
        return $this->hasMany(TownWard::class);
    }

    public function customerLead()
    {
        return $this->hasMany(CustomerLead::class);
    }

    public function customerPotentail()
    {
        return $this->hasMany(CustomerPotentail::class);
    }
}
