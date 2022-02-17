<?php

namespace GGPHP\Crm\WebForm\Models;

use GGPHP\Core\Models\UuidModel;

class WebFormCustomer extends UuidModel
{

    protected $table = 'web_form_customers';

    protected $fillable = [
        'full_name', 'phone', 'email', 'branch_id', 'district_id', 'marketing_program_id'
    ];
}
