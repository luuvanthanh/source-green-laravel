<?php

namespace GGPHP\Crm\WebForm\Models;

use GGPHP\Core\Models\UuidModel;

class WebFormChildren extends UuidModel
{
    protected $table = 'web_form_childrens';

    protected $fillable = [
        'full_name', 'birth_date', 'web_form_customer_id'
    ];
}
