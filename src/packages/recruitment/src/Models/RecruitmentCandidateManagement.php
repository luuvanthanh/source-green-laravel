<?php

namespace GGPHP\Recruitment\Models;

use GGPHP\Category\Models\Division;
use GGPHP\Core\Models\UuidModel;

class RecruitmentCandidateManagement extends UuidModel
{
    public $incrementing = false;

    const STATUS = [
        'UNCONFIMRED' => 1,
        'NOT_ACHIEVED' => 2,
        'PASS' => 3
    ];

    /**
     * Declare the table name
     */
    protected $table = 'CandidateManagements';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Name',
        'Date',
        'Location',
        'Phone',
        'DivisionId',
        'RecruitmentLevelId',
        'RecruitmentManagerId',
        'Status',
        'File',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function level()
    {
        return $this->belongsTo(RecruitmentLevel::class, 'RecruitmentLevelId');
    }

    public function division()
    {
        return $this->belongsTo(Division::class, 'DivisionId');
    }

    public function recruitmentManagement()
    {
        return $this->belongsTo(RecruitmentManager::class, 'RecruitmentManagerId');
    }

    public function questionCandidate()
    {
        return $this->hasMany(QuestionCandidate::class, 'CandidateManagementId');
    }
}
