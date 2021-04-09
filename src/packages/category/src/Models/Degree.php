<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class Degree extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'degrees';

    protected $fillable = [
        'code', 'name',
    ];

}
