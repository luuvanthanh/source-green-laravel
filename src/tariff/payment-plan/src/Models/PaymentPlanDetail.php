<?php

namespace GGPHP\Tariff\PaymentPlan\Models;

use GGPHP\Clover\Models\Student;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\ChargeOldStudent;

class PaymentPlanDetail extends UuidModel
{
    protected $table = 'fee.PaymentPlanDetails';

    protected $fillable = [
        'ChargeOldStudentId', 'Note', 'PaymentPlanId', 'StudentId', 'FeeInfo', 'TotalMoneyMonth'
    ];

    protected $casts = [
        'FeeInfo' => 'array'
    ];

    public function paymentPlan()
    {
        return $this->belongsTo(PaymentPlan::class, 'PaymentPlanId');
    }

    public function chargeOldStudent()
    {
        return $this->belongsTo(ChargeOldStudent::class, 'ChargeOldStudentId');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'StudentId');
    }
}
