<?php

namespace GGPHP\Crm\Category\Models;


use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerTag;
use GGPHP\Crm\CustomerPotentail\Models\CustomerPotentail;
use GGPHP\Crm\CustomerPotentail\Models\CustomerPotentailTag;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tag extends UuidModel
{
    use SoftDeletes;

    protected $table = 'tags';

    public $incrementing = false;

    public $fillable = [
        'name'
    ];

    public function customerTag()
    {
        return $this->hasMany(CustomerTag::class);
    }

    public function customerPotentailTag()
    {
        return $this->hasMany(CustomerPotentailTag::class);
    }
}
