<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class EducationalLevel extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'EducationalLevels';

    protected $fillable = [
        'Code', 'Name',
    ];

}
