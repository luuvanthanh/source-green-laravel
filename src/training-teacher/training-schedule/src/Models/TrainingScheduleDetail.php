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
    protected $table = 'evaluate_teacher.TrainingScheduleDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'DateTraining', 'StartTime', 'EndTime', 'Location', 'TrainingScheduleId'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'DateTraining' => 'date_format:Y-m-d'
    ];

    public function employee()
    {
        return $this->belongsToMany(User::class, 'evaluate_teacher.TrainingScheduleDetailEmployees', 'TrainingScheduleDetailId', 'EmployeeId');
    }

    public function trainer()
    {
        return $this->belongsToMany(User::class, 'evaluate_teacher.TrainingScheduleDetailTrainers', 'TrainingScheduleDetailId', 'TrainerId');
    }
}
