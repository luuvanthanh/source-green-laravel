<?php

namespace GGPHP\Crm\Fee\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassType extends UuidModel
{
    use SoftDeletes;

    protected $table = 'class_types';

    protected $fillable = [
        'name', 'code', 'from', 'to', 'description', 'class_type_clover_id'
    ];
}
