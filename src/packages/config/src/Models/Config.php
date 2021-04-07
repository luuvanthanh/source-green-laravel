<?php

namespace GGPHP\Config\Models;

use GGPHP\Core\Models\UuidModel;

class Config extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'configs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'code', 'value',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

}
