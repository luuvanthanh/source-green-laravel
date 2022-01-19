<?php

namespace GGPHP\ChildDevelop\Category\Models;

use GGPHP\Core\Models\UuidModel;

class CategoryChildIssue extends UuidModel
{
    const CODE = 'VD';

    protected $table = 'CategoryChildIssues';

    protected $fillable = [
        'Code', 'Name', 'CategoryChildIssueCrmId'
    ];
}
