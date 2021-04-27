<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class TrainingMajor extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'TrainingMajors';

    protected $fillable = [
        'Code', 'Name',
    ];

}
