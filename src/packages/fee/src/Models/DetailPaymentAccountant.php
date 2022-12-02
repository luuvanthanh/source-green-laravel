<?php

namespace GGPHP\Fee\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class DetailPaymentAccountant extends UuidModel
{
    use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.DetailPaymentAccountants';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ChargeOldStudentId', 'FeeId', 'Money', 'Month'
    ];

    public function chargeOldStudent()
    {
        return $this->belongsTo(ChargeOldStudent::class, 'ChargeOldStudentId');
    }
}
