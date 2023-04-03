<?php

namespace GGPHP\Recruitment\Models;

use GGPHP\Core\Models\UuidModel;

class RecruitmentQuestion extends UuidModel
{
    public $incrementing = false;


    /**
     * Declare the table name
     */
    protected $table = 'RecruitmentQuestions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Name',
        'RecruitmentConfigurationId',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function recruitmentConfiguration()
    {
        return $this->belongsTo(RecruitmentConfiguration::class, 'RecruitmentConfigurationId');
    }
}
