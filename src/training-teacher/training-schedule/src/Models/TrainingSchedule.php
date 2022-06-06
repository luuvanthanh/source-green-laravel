<?php

namespace GGPHP\TrainingTeacher\TrainingSchedule\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class TrainingSchedule extends UuidModel
{
    /**
     * Declare the table name
     */
    protected $table = 'evaluate-teacher.TrainingSchedules';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'TrainingModuleId', 'TrainingModuleDetailId', 'StartDate', 'EndDate'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function trainingScheduleDetail()
    {
        return $this->hasMany(TrainingScheduleDetail::class, 'TrainingScheduleId');
    }

    public function employee()
    {
        return $this->belongsToMany(User::class, 'evaluate-teacher.TrainingScheduleEmployees', 'TrainingScheduleId', 'EmployeeId');
    }
}
