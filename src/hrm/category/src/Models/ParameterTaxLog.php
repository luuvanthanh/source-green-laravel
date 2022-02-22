<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class ParameterTaxLog extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ParameterTaxLogs';

    protected $fillable = [
        'ParameterTaxId', 'EditEmployee', 'EditDate', 'From', 'To', 'Fax', 'ApplyDate',
    ];
}
