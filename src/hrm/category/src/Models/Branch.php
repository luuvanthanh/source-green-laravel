<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class Branch extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'Branches';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'Address', 'BranchIdCrm', 'Latitude', 'Longitude', 'CityId'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function city()
    {
        return $this->belongsTo(City::class, 'CityId');
    }
}
