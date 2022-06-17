<?php

namespace GGPHP\TrainingTeacher\Category\Models;

use GGPHP\Core\Models\UuidModel;

class TrainingModuleDetail extends UuidModel
{
    /**
     * Declare the table name
     */
    protected $table = 'evaluate_teacher.TrainingModuleDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'TrainingModulelId', 'TrainingSkillDetailId', 'IsActive'
    ];
}
