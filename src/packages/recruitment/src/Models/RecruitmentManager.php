<?php

namespace GGPHP\Recruitment\Models;

use GGPHP\Core\Models\UuidModel;

class RecruitmentManager extends UuidModel
{
    public $incrementing = false;

    const CODE = 'TD';

    /**
     * Declare the table name
     */
    protected $table = 'RecruitmentManagers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code',
        'Name',
        'startDate',
        'endDate',
        'numberOfRecruitments',
        'DivisionId',
        'RecruitmentLevelId',
        'RecruitmentConfigurationId',
        'numberOfCandidates',
        'numberOfCandidatesPass'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
