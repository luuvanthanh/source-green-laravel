<?php

namespace GGPHP\Crm\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuestionReview extends UuidModel
{
    use SoftDeletes;

    protected $table = 'question_reviews';

    protected $fillable = [
        'question'
    ];
}
