<?php

namespace GGPHP\Crm\Marketing\Models;

use GGPHP\Core\Models\UuidModel;


class DataMarketingProgram extends UuidModel
{

    protected $table = 'data_marketing_program';

    protected $fillable = [
        'data_marketing_id', 'marketing_program_id'
    ];
}
