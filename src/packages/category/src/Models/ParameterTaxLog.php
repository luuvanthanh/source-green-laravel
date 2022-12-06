<?php

namespace GGPHP\Category\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class ParameterTaxLog extends UuidModel
{
    use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ParameterTaxLogs';

    protected $fillable = [
        'ParameterTaxId', 'EditEmployee', 'EditDate', 'From', 'To', 'Fax', 'ApplyDate',
    ];
}
