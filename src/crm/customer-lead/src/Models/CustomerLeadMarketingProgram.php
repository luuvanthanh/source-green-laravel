<?php

namespace GGPHP\Crm\CustomerLead\Models;

use GGPHP\Core\Models\UuidModel;

class CustomerLeadMarketingProgram extends UuidModel
{
    protected $table = 'customer_lead_marketing_program';

    public $fillable = [
        'customer_lead_id', 'marketing_program_id'
    ];
}
