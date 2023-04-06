<?php

namespace GGPHP\InterviewManager\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\SchoolYear;

class EvaluationCriteria extends UuidModel
{
    CONST CODE = 'TCDG';
    //use ActivityLogTrait;
    /**
     * Declare the table name
     */
    protected $table = 'EvaluationCriteriass';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code',
        'Name',
        'Note'
    ];
}
