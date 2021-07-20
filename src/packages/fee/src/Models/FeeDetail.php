<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class FeeDetail extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.FeeDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'FeePoliceId', 'ClassTypeId', 'PaymentFormId', 'Content', 'ApplyStartTime', 'ApplyEndTime', 'OldStudent', 'NewStudent',
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function classType()
    {
        return $this->belongsTo(\GGPHP\Fee\Models\ClassType::class, 'ClassTypeId');
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function paymentForm()
    {
        return $this->belongsTo(\GGPHP\Fee\Models\PaymentForm::class, 'PaymentFormId');
    }
}
