<?php

namespace GGPHP\ChildDevelop\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Logo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'Logos';

    protected $fillable = [
        'Logo',
    ];
}
