<?php

namespace GGPHP\Crm\Icon\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;

class CategoryIcon extends UuidModel
{
    protected $table = 'category_icons';

    protected $fillable = [
        'name'
    ];

    public function icon()
    {
        return $this->hasMany(Icon::class);
    }
}
