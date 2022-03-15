<?php

namespace GGPHP\EvaluateTeacher\Category\Models;

use GGPHP\Core\Models\UuidModel;

class RatingLevel extends UuidModel
{
    protected $table = 'RatingLevels';

    protected $fillable = [
        'Code', 'Name', 'Description', 'Type', 'Number'
    ];

    public static function boot()
    {
        parent::boot();
        self::creating(function ($model) {
            $model->Number = $model->max('Number') + 1;
        });
    }
}
