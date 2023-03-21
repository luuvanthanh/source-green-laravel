<?php

namespace GGPHP\Recruitment\Models;

use GGPHP\Category\Models\Division;
use GGPHP\Core\Models\UuidModel;

class RecruitmentConfiguration extends UuidModel
{
    public $incrementing = false;

    const CODE = 'CHTD';

    /**
     * Declare the table name
     */
    protected $table = 'RecruitmentConfigurations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code',
        'Name',
        'Note',
        'DivisionId',
        'RecruitmentLevelId',
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

    public function question()
    {
        return $this->hasMany(RecruitmentQuestion::class, 'RecruitmentConfigurationId');
    }
}
