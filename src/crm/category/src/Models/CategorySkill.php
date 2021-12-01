<?php

namespace GGPHP\Crm\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategorySkill extends UuidModel
{
    use SoftDeletes;

    const CODE = 'KN0';

    protected $table = 'category_skills';

    protected $fillable = [
        'code', 'name', 'use'
    ];
}
