<?php

namespace GGPHP\Crm\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class Tuition extends UuidModel
{
    protected $table = 'tuitions';

    protected $fillable = [
        'charge_student_id', 'payment_form_id', 'money', 'fee_id'
    ];

    public function chargeStudent()
    {
        return $this->belongsTo(ChargeStudent::class);
    }

    public function paymentForm()
    {
        return $this->belongsTo(PaymentForm::class);
    }

    public function fee()
    {
        return $this->belongsTo(Fee::class);
    }
}
