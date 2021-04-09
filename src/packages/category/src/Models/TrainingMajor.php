<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class TrainingMajor extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'training_majors';

    protected $fillable = [
        'code', 'name',
    ];

}
