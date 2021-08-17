<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class ChangeParameterDetail extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.ChangeParameterDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ChangeParameterId', 'Date', 'DuaDate', 'ActualWeek', 'StartDate', 'EndDate', 'PaymentFormId', 'FullMonth', 'SchoolDay',
    ];

    protected $dateTimeFields = [];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [];

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
    public function changeParameter()
    {
        return $this->belongsTo(\GGPHP\Fee\Models\ChangeParameter::class, 'ChangeParameterId');
    }
}
