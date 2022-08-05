<?php

namespace GGPHP\TrainingTeacher\Category\Models;

use GGPHP\Core\Models\UuidModel;

class TrainingSkillDetail extends UuidModel
{
    const TRAINING_HUMAN = [
        'ARKKI' => 1,
        'OUTSOURCE' => 2
    ];

    /**
     * Declare the table name
     */
    protected $table = 'evaluate_teacher.TrainingSkillDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Skill', 'Content', 'TrainingFormId', 'TrainingHuman', 'TheoryTrainingTime', 'TheoreticalTrainingGoal', 'PracticalTrainingTime', 'PracticalTrainingGoal', 'IsUse', 'TrainingSkillId'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function trainingSkill()
    {
        return $this->belongsTo(TrainingSkill::class, 'TrainingSkillId');
    }

    public function trainingForm()
    {
        return $this->belongsTo(TrainingForm::class, 'TrainingFormId');
    }
}
