<?php

namespace GGPHP\Recruitment\Models;

use GGPHP\Category\Models\Division;
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
        'StartDate',
        'EndDate',
        'NumberOfRecruitments',
        'DivisionId',
        'RecruitmentLevelId',
        'RecruitmentConfigurationId',
        'NumberOfCandidates',
        'NumberOfCandidatesPass',
        'Link'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function candidate()
    {
        return $this->hasMany(RecruitmentCandidateManagement::class, 'RecruitmentManagerId');
    }

    public function recruitmentConfiguration()
    {
        return $this->belongsTo(RecruitmentConfiguration::class, 'RecruitmentConfigurationId');
    }

    public function level()
    {
        return $this->belongsTo(RecruitmentLevel::class, 'RecruitmentLevelId');
    }

    public function division()
    {
        return $this->belongsTo(Division::class, 'DivisionId');
    }
}
