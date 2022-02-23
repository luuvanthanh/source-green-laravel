<?php

namespace GGPHP\Crm\Fee\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentForm extends UuidModel
{
    use SoftDeletes;

    protected $table = 'payment_forms';

    protected $fillable = [
        'name', 'code', 'type', 'is_semester', 'payment_form_clover_id'
    ];
}
