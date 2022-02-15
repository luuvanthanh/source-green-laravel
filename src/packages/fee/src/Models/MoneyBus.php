<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class MoneyBus extends UuidModel
{
    protected $table = 'fee.MoneyBuses';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'FeePoliceId', 'ClassTypeId', 'PaymentFormId', 'Money',
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
    public function classType()
    {
        return $this->belongsTo(\GGPHP\Fee\Models\ClassType::class, 'ClassTypeId');
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function feePolicie()
    {
        return $this->belongsTo(\GGPHP\Fee\Models\FeePolicie::class, 'FeePoliceId');
    }
}
