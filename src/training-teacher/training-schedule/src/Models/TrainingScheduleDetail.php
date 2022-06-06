<?php

namespace GGPHP\TrainingTeacher\TrainingSchedule\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\TrainingTeacher\Category\Models\TrainingModule;
use GGPHP\Users\Models\User;

class TrainingScheduleDetail extends UuidModel
{
    /**
     * Declare the table name
     */
    protected $table = 'evaluate-teacher.TrainingScheduleDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'DateTraining', 'TimeTraining', 'Location', 'TrainingScheduleId'
    ];

    public function employee()
    {
        return $this->belongsToMany(User::class, 'evaluate-teacher.TrainingScheduleDetailEmployees', 'TrainingScheduleDetailId', 'EmployeeId');
    }

    public function trainer()
    {
        return $this->belongsToMany(User::class, 'evaluate-teacher.TrainingScheduleDetailTrainers', 'TrainingScheduleDetailId', 'TrainerId');
    }
}
