<?php

namespace GGPHP\Crm\Config\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassArrangement extends UuidModel
{
    use SoftDeletes;

    protected $table = 'class_arrangements';

    protected $fillable = [
        'file_image', 'name', 'content', 'time'
    ];
}
