<?php

namespace GGPHP\DecisionNumberSample\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class DecisionNumberSample extends UuidModel
{
    use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'DecisionNumberSamples';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'OrdinalNumber', 'NumberForm', 'Type', 'StartDate', 'EndDate'
    ];

    const TYPE = [
        'TRANSFER' => 1,
        'APPOINT' => 2,
        'DISMISSED' => 3,
        'DISCIPLINE_REWARD' => 4,
        'SALARY_INCREASES' => 5,
        'RESIGNATION' => 6,
        'SUSPEND' => 7
    ];
}
