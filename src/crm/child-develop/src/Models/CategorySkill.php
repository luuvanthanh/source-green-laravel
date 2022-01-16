<?php

namespace GGPHP\Crm\ChildDevelop\Models;

use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluate;
use GGPHP\Core\Models\UuidModel;

class CategorySkill extends UuidModel
{
    const CODE = 'KN0';

    protected $table = 'category_skills';

    protected $fillable = [
        'code', 'name', 'use', 'numerical_skill'
    ];

    public function childEvaluate()
    {
        return $this->hasMany(ChildEvaluate::class, 'category_skill_id');
    }
}
