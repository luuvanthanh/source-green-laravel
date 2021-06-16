<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class PaymentForm extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'PaymentForms';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'Type',
    ];

}
