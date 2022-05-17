<?php

namespace GGPHP\TrainingTeacher\Category\Models;

use GGPHP\Core\Models\UuidModel;

class TrainingSkill extends UuidModel
{
    /**
     * Declare the table name
     */
    protected $table = 'evaluate-teacher.TrainingSkills';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'Note'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function trainingSkillDetail()
    {
        return $this->hasMany(TrainingSkillDetail::class, 'TrainingSkillId');
    }
}
