<?php

namespace GGPHP\Crm\Category\Models;


use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;
use Illuminate\Database\Eloquent\SoftDeletes;

class StatusParentPotential extends UuidModel
{
    use SoftDeletes;

    const CODE = 'TTN';

    protected $table = 'status_parent_potentials';

    public $incrementing = false;

    public $fillable = [
        'name', 'code'
    ];

    public function customerPotentialStatusCare()
    {
        return $this->hasMany(CustomerPotential::class);
    }
}
