<?php

namespace GGPHP\Crm\Category\Models;


use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerTag;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialTag;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tag extends UuidModel
{
    use SoftDeletes;

    protected $table = 'tags';

    public $incrementing = false;

    public $fillable = [
        'name', 'color_code'
    ];

    public function customerTag()
    {
        return $this->hasMany(CustomerTag::class);
    }

    public function customerPotentialTag()
    {
        return $this->hasMany(CustomerPotentialTag::class);
    }
}
