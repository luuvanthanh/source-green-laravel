<?php

namespace GGPHP\Crm\Config\Models;

use GGPHP\Core\Models\UuidModel;

class ClassArrangement extends UuidModel
{
    protected $table = 'class_arrangements';

    protected $fillable = [
        'file_image', 'name', 'content'
    ];
}
