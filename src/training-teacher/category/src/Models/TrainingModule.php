<?php

namespace GGPHP\TrainingTeacher\Category\Models;

use GGPHP\Clover\Models\Item;
use GGPHP\Core\Models\UuidModel;

class TrainingModule extends UuidModel
{
    /**
     * Declare the table name
     */
    protected $table = 'evaluate-teacher.TrainingModules';

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
        return $this->belongsToMany(TrainingSkill::class, 'evaluate-teacher.TrainingModuleTrainingSkills', 'TrainingModuleId', 'TrainingSkillId');
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'ItemId');
    }
}
