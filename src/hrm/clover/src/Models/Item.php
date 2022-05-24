<?php

namespace GGPHP\Clover\Models;

use GGPHP\Core\Models\UuidModel;

class Item extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'common.Items';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'description', 'Type'
    ];
}
