<?php

namespace GGPHP\Crm\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryRelationship extends UuidModel
{
    use SoftDeletes;

    const CODE = 'MQH';

    protected $table = 'category_relationships';

    protected $fillable = [
        'code', 'name'
    ];
}
