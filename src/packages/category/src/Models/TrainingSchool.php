<?php

namespace GGPHP\Category\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class TrainingSchool extends UuidModel
{
    use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'TrainingSchools';

    protected $fillable = [
        'Code', 'Name', 'Address',
    ];
}
