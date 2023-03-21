<?php

namespace GGPHP\Recruitment\Models;

use GGPHP\Core\Models\UuidModel;

class QuestionCandidate extends UuidModel
{
    public $incrementing = false;


    /**
     * Declare the table name
     */
    protected $table = 'QuestionCandidates';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'CandidateManagementId',
        'RecruitmentQuestionId',
        'Answer'
    ];
}
