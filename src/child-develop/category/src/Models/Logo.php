<?php

namespace GGPHP\ChildDevelop\Category\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Logo extends UuidModel
{
    //use ActivityLogTrait;
    use SoftDeletes;

    protected $table = 'Logos';

    protected $fillable = [
        'Logo',
    ];
}
