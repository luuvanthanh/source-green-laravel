<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class MoneyMeal extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.MoneyMeals';

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
}
