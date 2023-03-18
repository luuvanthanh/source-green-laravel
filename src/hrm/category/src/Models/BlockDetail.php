<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlockDetail extends UuidModel
{
    use SoftDeletes;
    use SoftDeletes;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'BlockDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'BlockId',
        'Name',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
