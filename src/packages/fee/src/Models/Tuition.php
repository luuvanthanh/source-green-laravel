<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class Tuition extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.Tuitions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ChargeStudentId', 'FeeId', 'PaymentFormId', 'Money',
    ];

}
