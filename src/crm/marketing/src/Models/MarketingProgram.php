<?php

namespace GGPHP\Crm\Marketing\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class MarketingProgram extends UuidModel
{
    use SoftDeletes;

    protected $table = 'marketing_programs';

    const CODE = 'CT';

    const STATUS = [
        'APPLY' => 0,
        'NOT_APPLY' => 1,
    ];

    protected $fillable = [
        'code', 'name', 'start_date', 'end_date', 'status', 'content', 'note'
    ];
}
