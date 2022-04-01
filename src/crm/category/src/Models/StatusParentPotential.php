<?php

namespace GGPHP\Crm\Category\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialReference;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialStatusCare;
use Illuminate\Database\Eloquent\SoftDeletes;

class StatusParentPotential extends UuidModel
{
    use SoftDeletes;

    const CODE = 'TTN';

    const NUMBER_STATUS = [
        'SALE_ONLINE' => 1,
        'SIGHTSEEING' => 2,
        'ADMISSION_REGISTER' => 3,
        'TEST_INPUT' => 4
    ];

    protected $table = 'status_parent_potentials';

    public $incrementing = false;

    public $fillable = [
        'name', 'code', 'use', 'status_hard', 'number'
    ];

    public function customerPotentialStatusCare()
    {
        return $this->hasMany(CustomerPotentialStatusCare::class);
    }

    public function customerPotentialReference()
    {
        return $this->hasMany(CustomerPotentialReference::class);
    }

    public static function boot()
    {
        parent::boot();
        self::creating(function ($model) {
            $model->number = $model->max('number') + 1;
        });
    }
}
