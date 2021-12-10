<?php

namespace GGPHP\ChildDevelop\Category\Models;

use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluate;
use GGPHP\Core\Models\UuidModel;

class CategorySkill extends UuidModel
{
    const CODE = 'KN0';

    protected $table = 'CategorySkills';

    protected $fillable = [
        'Code', 'Name', 'Use', 'NumericalSkill'
    ];

    public function childEvaluate()
    {
        return $this->hasMany(ChildEvaluate::class, 'CategorySkillId');
    }
}
