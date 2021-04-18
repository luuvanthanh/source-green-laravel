<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class TrainingSchool extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'TrainingSchools';

    protected $fillable = [
        'Code', 'Name', 'Address',
    ];

}
