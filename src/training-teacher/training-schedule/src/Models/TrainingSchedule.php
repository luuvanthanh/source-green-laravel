<?php

namespace GGPHP\TrainingTeacher\TrainingSchedule\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\TrainingTeacher\Category\Models\TrainingModule;
use GGPHP\TrainingTeacher\Category\Models\TrainingModuleDetail;
use GGPHP\Users\Models\User;

class TrainingSchedule extends UuidModel
{
    /**
     * Declare the table name
     */
    protected $table = 'evaluate_teacher.TrainingSchedules';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'TrainingModuleId', 'TrainingModuleDetailId', 'StartDate', 'EndDate'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'StartDate' => 'date_format:Y-m-d',
        'EndDate' => 'date_format:Y-m-d',
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
        return $this->belongsToMany(User::class, 'evaluate_teacher.TrainingScheduleEmployees', 'TrainingScheduleId', 'EmployeeId');
    }

    public function trainingModule()
    {
        return $this->belongsTo(TrainingModule::class, 'TrainingModuleId');
    }

    public function trainingModuleDetail()
    {
        return $this->belongsTo(TrainingModuleDetail::class, 'TrainingModuleDetailId');
    }
}
