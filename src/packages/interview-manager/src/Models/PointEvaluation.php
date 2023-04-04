<?php

namespace GGPHP\InterviewManager\Models;

use GGPHP\Core\Models\UuidModel;

class PointEvaluation extends UuidModel
{
    //use ActivityLogTrait;
    /**
     * Declare the table name
     */
    protected $table = 'PointEvaluations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'PointFrom',
        'PointTo',
        'Classification'
    ];
}
