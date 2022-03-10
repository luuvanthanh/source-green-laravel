<?php

namespace GGPHP\EvaluateTeacher\Category\Models;

use GGPHP\Core\Models\UuidModel;

class RatingLevel extends UuidModel
{
    protected $table = 'RatingLevels';

    protected $fillable = [
        'Code', 'Name', 'Description', 'Type'
    ];
}
