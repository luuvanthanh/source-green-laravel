<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class ObjectType extends UuidModel
{
    use SoftDeletes;

    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'object_types';

    public $fillable = [
        'name',
    ];
}
