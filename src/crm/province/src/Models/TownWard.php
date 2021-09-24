<?php

namespace GGPHP\Crm\Province\Models;

use GGPHP\ConfigShippingFee\Models\ConfigShippingFeeDetail;
use GGPHP\Core\Models\UuidModel;

class TownWard extends UuidModel
{
    protected $table = 'town_wards';

    protected $fillable = [
        'name', 'district_id'
    ];

    public function district()
    {
        return $this->belongsTo(District::class);
    }
}
