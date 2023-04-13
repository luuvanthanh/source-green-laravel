<?php

namespace GGPHP\InterviewManager\Models;

use GGPHP\Category\Models\Division;
use GGPHP\Core\Models\UuidModel;

class InterviewConfiguration extends UuidModel
{
    CONST CODE = 'CH';
    //use ActivityLogTrait;
    /**
     * Declare the table name
     */
    protected $table = 'InterviewConfigurations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code',
        'DivisionId',
        'Name',
        'Note',
    ];

    public function interviewConfigurationEvaluationCriteria()
    {
        return $this->belongsToMany(EvaluationCriteria::class, 'InterviewConfigurationEvaluationCriterias', 'InterviewConfigurationId', 'EvaluationCriteriaId');
    }

    public function division()
    {
        return $this->belongsTo(Division::class, 'DivisionId');
    }

    public function interviewer()
    {
        return $this->belongsTo(Interviewer::class, 'DivisionId', 'DivisionId');
    }
}
