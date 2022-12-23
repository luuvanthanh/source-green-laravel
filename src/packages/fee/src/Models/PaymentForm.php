<?php

namespace GGPHP\Fee\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class PaymentForm extends UuidModel
{
    //use ActivityLogTrait;
    const CODE = [
        'NAM' => 'NAM',
        'HOCKY1' => 'HOCKY1',
        'HOCKY2' => 'HOCKY2',
        'HOCKY1_HOCKY2' => 'HOCKY1_HOCKY2',
        'THANG' => 'THANG'
    ];

    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.PaymentForms';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'Type', 'IsSemester', 'PaymentFormCrmId'
    ];
}
