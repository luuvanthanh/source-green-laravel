<?php

namespace GGPHP\InterviewManager\Models;

use GGPHP\Core\Models\UuidModel;

class InterviewConfigurationEvaluationCriteria extends UuidModel
{
    //use ActivityLogTrait;
    /**
     * Declare the table name
     */
    protected $table = 'InterviewConfigurationEvaluationCriterias';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'InterviewConfigurationId',
        'EvaluationCriteriaId',
    ];
}
