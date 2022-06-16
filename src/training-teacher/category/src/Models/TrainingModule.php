<?php

namespace GGPHP\TrainingTeacher\Category\Models;

use GGPHP\Clover\Models\Item;
use GGPHP\Core\Models\UuidModel;
use GGPHP\TrainingTeacher\TrainingSchedule\Models\TrainingSchedule;

class TrainingModule extends UuidModel
{
    /**
     * Declare the table name
     */
    protected $table = 'evaluate_teacher.TrainingModules';

    const CODE = 'MD';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'ItemId', 'SerialNumber', 'TrainingTime'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function trainingModuleDetail()
    {
        return $this->hasMany(TrainingModuleDetail::class, 'TrainingModulelId');
    }

    public function trainingModuleTrainingSkill()
    {
        return $this->belongsToMany(TrainingSkill::class, 'evaluate_teacher.TrainingModuleTrainingSkills', 'TrainingModuleId', 'TrainingSkillId');
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'ItemId');
    }

    public function trainingSchedule()
    {
        return $this->hasMany(TrainingSchedule::class, 'TrainingModuleId');
    }
}
