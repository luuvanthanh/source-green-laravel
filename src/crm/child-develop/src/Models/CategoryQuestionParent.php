<?php

namespace GGPHP\Crm\ChildDevelop\Models;

use GGPHP\Core\Models\UuidModel;

class CategoryQuestionParent extends UuidModel
{
    protected $table = 'category_question_parents';

    protected $fillable = [
        'question'
    ];
}
