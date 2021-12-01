<?php

namespace GGPHP\Crm\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryChildIssue extends UuidModel
{
    use SoftDeletes;

    const CODE = 'VD';
    
    protected $table = 'category_child_issues';

    protected $fillable = [
        'code', 'name'
    ];
}
