<?php

namespace GGPHP\Crm\Icon\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;

class Icon extends UuidModel
{
    protected $table = 'icons';

    protected $fillable = [
        'icon', 'category_icon_id'
    ];

    public function customerLead()
    {
        return $this->hasMany(CustomerLead::class);
    }

    public function categoryIcon()
    {
        return $this->belongsTo(CategoryIcon::class);
    }
}
