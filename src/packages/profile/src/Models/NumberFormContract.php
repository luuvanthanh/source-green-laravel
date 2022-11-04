<?php

namespace GGPHP\Profile\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class NumberFormContract extends UuidModel
{
    use ActivityLogTrait;
    protected $table = 'NumberFormContracts';

    protected $fillable = [
        'OrdinalNumber', 'NumberForm', 'Type', 'StartDate', 'EndDate'
    ];

    const TYPE = [
        'LABOUR' => 1,
        'PROBATIONARY' => 2,
        'SEASONAL' => 3
    ];
}
