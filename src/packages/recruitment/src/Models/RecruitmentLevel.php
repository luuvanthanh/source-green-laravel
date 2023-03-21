<?php

namespace GGPHP\Recruitment\Models;

use GGPHP\Core\Models\UuidModel;

class RecruitmentLevel extends UuidModel
{
    public $incrementing = false;

    const CODE = 'LV';

    /**
     * Declare the table name
     */
    protected $table = 'RecruitmentLevels';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code',
        'Name',
        'Decription',
        'Note',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function recruitmentConfiguration()
    {
        return $this->hasMany(RecruitmentConfiguration::class, 'RecruitmentLevelId');
    }
}
