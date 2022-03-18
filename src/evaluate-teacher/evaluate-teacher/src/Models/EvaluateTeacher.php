<?php

namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\EvaluateTeacher\Category\Models\EvaluateStep;
use GGPHP\EvaluateTeacher\Category\Models\EvaluateType;
use GGPHP\EvaluateTeacher\Category\Models\RatingLevel;
use GGPHP\Users\Models\User;

class EvaluateTeacher extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'evaluate-teacher.EvaluateTeachers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EvaluateStepId', 'EvaluateTypeId', 'TeacherEvaluate', 'TeacherAreEvaluate', 'RatingLevelId', 'File'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function evaluateTeacherDetail()
    {
        return $this->hasMany(EvaluateTeacherDetail::class, 'EvaluateTeacherId');
    }

    public function evaluateStep()
    {
        return $this->belongsTo(EvaluateStep::class, 'EvaluateStepId');
    }

    public function evaluateType()
    {
        return $this->belongsTo(EvaluateType::class, 'EvaluateTypeId');
    }

    public function teacherEvaluate()
    {
        return $this->belongsTo(User::class, 'TeacherEvaluate');
    }

    public function teacherAreEvaluate()
    {
        return $this->belongsTo(User::class, 'TeacherAreEvaluate');
    }

    public function ratingLevel()
    {
        return $this->belongsTo(RatingLevel::class, 'RatingLevelId');
    }
}
