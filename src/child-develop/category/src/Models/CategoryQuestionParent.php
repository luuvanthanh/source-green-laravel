<?php

namespace GGPHP\ChildDevelop\Category\Models;

use GGPHP\Core\Models\UuidModel;

class CategoryQuestionParent extends UuidModel
{
    protected $table = 'CategoryQuestionParents';

    protected $fillable = [
        'Question'
    ];
}
