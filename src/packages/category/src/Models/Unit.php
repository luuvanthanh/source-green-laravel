<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends UuidModel
{
    use SoftDeletes;

    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'units';

    public $fillable = [
        'name'
    ];
}
