<?php

namespace GGPHP\EvaluateTeacher\Category\Models;

use GGPHP\Category\Models\TypeOfContract;
use GGPHP\Core\Models\UuidModel;

class EvaluateStep extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'evaluate-teacher.EvaluateSteps';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function evaluateType()
    {
        return $this->belongsToMany(EvaluateType::class, 'evaluate-teacher.EvaluateStepEvaluateType', 'EvaluateStepId', 'EvaluateTypeId');
    }
}
