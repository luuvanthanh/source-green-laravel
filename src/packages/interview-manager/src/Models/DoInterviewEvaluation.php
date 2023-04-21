<?php

namespace GGPHP\InterviewManager\Models;

use GGPHP\Category\Models\Division;
use GGPHP\Core\Models\UuidModel;

class DoInterviewEvaluation extends UuidModel
{
    //use ActivityLogTrait;
    /**
     * Declare the table name
     */
    protected $table = 'DoInterviewEvaluations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'DoInterviewId',
        'EvaluationCriteriaId'
    ];
}
