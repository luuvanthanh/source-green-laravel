<?php

namespace GGPHP\Crm\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryEvent extends UuidModel
{
    use SoftDeletes
    ;

    const CODE = 'SK';

    protected $table = 'category_events';

    protected $fillable = [
        'code', 'name', 'description'
    ];
}
