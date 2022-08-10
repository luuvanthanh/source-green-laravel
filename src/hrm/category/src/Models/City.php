<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class City extends UuidModel
{
    protected $table = 'Citys';

    protected $fillable = [
        'Name', 'NumericalCity', 'Code'
    ];

    public function branch()
    {
        return $this->hasMany(Branch::class, 'CityId');
    }
}
