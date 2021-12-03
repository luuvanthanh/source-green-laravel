<?php

namespace GGPHP\ChildDevelop\ChildEvaluate\Models;

use GGPHP\Core\Models\UuidModel;

class ChildEvaluate extends UuidModel
{
    protected $table = 'ChildEvaluates';

    protected $fillable = [
        'CategorySkillId', 'Age'
    ];

    const MONTH = [
        '0-6' => 0,
        '6-9' => 1,
        '9-12' => 2,
        '12-18' => 3,
        '18-24' => 4,
        '24-30' => 5,
        '30-36' => 6,
        '36-50' => 7,
        '50-60' => 8
    ];

    public function childEvaluateDetail()
    {
        return $this->hasMany(ChildEvaluateDetail::class,'ChildEvaluateId');
    }
}
