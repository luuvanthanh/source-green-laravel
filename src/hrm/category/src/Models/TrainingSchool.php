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
    const CATEGORY = [
        'SCHOOL_TRAINING' => 0,
        'SCHOOL_PARTNER' => 1
    ];

    protected $fillable = [
        'Code', 'Name', 'Address', 'Category'
    ];
}
