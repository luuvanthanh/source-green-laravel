<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class ExpectedToCollectMoney extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.ExpectedToCollectMoneys';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Name', 'Money', 'FeeId', 'Month', 'StudentId', 'ChargeOldStudentId'
    ];
}
