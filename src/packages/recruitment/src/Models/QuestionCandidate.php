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

    public function recruitmentConfiguration()
    {
        return $this->hasMany(RecruitmentConfiguration::class, 'RecruitmentLevelId');
    }

    public function recruitmentQuestion()
    {
        return $this->belongsTo(RecruitmentQuestion::class, 'RecruitmentQuestionId');
    }
}
