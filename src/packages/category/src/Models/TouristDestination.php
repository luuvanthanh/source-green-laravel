<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class TouristDestination extends UuidModel
{
    use SoftDeletes;

    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'tourist_destinations';

    public $fillable = [
        'name', 'address', 'phone', 'email', 'website', 'address_limit'
    ];

    protected $casts = [
        'address_limit'  =>  'array',
    ];
}
