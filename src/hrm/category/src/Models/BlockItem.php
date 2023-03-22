<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModelNotSoftDelete;

class BlockItem extends UuidModelNotSoftDelete
{
    public $incrementing = false;
    /**
     * Declare the table name
     */
    protected $table = 'BlockItems';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'BlockId',
        'ItemId',
        'Type',
        'ParentId',
        'OrderIndex'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
