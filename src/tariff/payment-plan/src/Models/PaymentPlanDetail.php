<?php

namespace GGPHP\Tariff\PaymentPlan\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\ChargeOldStudent;

class PaymentPlanDetail extends UuidModel
{
    protected $table = 'fee.PaymentPlanDetails';

    protected $fillable = [
        'ChargeOldStudentId', 'Note', 'PaymentPlanId'
    ];

    public function paymentPlan()
    {
        return $this->belongsTo(PaymentPlan::class, 'PaymentPlanId');
    }

    public function chargeOldStudent()
    {
        return $this->belongsTo(ChargeOldStudent::class, 'ChargeOldStudentId');
    }
}
