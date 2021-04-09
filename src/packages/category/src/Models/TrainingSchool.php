<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class TrainingSchool extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'training_schools';

    protected $fillable = [
        'code', 'name', 'adress',
    ];

}
