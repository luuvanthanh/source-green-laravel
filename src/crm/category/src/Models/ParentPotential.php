<?php

namespace GGPHP\Crm\Category\Models;


use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class ParentPotential extends UuidModel
{
    use SoftDeletes;

    const CODE='TTN';

    protected $table = 'parent_potentials';

    public $incrementing = false;

    public $fillable = [
        'name', 'code'
    ];
}
