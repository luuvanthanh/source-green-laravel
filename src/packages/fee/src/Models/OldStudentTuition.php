<?php

namespace GGPHP\Fee\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class OldStudentTuition extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.OldStudentTuitions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ChargeOldStudentId', 'FeeId', 'PaymentFormId', 'Money', 'ApplyDate'
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function paymentForm()
    {
        return $this->belongsTo(\GGPHP\Fee\Models\PaymentForm::class, 'PaymentFormId');
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function fee()
    {
        return $this->belongsTo(\GGPHP\Fee\Models\Fee::class, 'FeeId');
    }

    public function chargeOldStudent()
    {
        return $this->belongsTo(ChargeOldStudent::class,'ChargeOldStudentId');
    }
}
