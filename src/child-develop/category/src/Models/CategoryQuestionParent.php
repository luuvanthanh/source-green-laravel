<?php

namespace GGPHP\ChildDevelop\Category\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class CategoryQuestionParent extends UuidModel
{
    use ActivityLogTrait;
    protected $table = 'CategoryQuestionParents';

    protected $fillable = [
        'Question', 'CategoryQuestionParentCrmId'
    ];
}
