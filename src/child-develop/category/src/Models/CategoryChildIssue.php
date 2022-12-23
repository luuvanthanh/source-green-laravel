<?php

namespace GGPHP\ChildDevelop\Category\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class CategoryChildIssue extends UuidModel
{
    //use ActivityLogTrait;
    const CODE = 'VD';

    protected $table = 'CategoryChildIssues';

    protected $fillable = [
        'Code', 'Name', 'CategoryChildIssueCrmId'
    ];
}
