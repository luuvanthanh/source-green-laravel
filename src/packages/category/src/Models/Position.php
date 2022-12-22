<?php

namespace GGPHP\Category\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class Position extends UuidModel
{
    use ActivityLogTrait;
    const HIEUTRUONG = 'HT';

    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'Positions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
