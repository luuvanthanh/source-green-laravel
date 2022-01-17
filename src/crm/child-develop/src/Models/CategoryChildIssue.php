<?php

namespace GGPHP\Crm\ChildDevelop\Models;

use GGPHP\Core\Models\UuidModel;

class CategoryChildIssue extends UuidModel
{
    const CODE = 'VD';

    protected $table = 'category_child_issues';

    protected $fillable = [
        'code', 'name'
    ];
}
