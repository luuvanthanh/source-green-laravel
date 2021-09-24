<?php

namespace GGPHP\Crm\Category\Models;


use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tag extends UuidModel
{
    use SoftDeletes;

    protected $table = 'tags';

    public $incrementing = false;

    public $fillable = [
        'name'
    ];
}
