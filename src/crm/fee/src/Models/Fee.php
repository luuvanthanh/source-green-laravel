<?php

namespace GGPHP\Crm\Fee\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Fee extends UuidModel
{
    use SoftDeletes;

    protected $table = 'fees';

    protected $fillable = [
        'name', 'code', 'type', 'fee_clover_id'
    ];
}
