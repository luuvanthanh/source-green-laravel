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
}
