<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class SchoolYearInformation extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.SchoolYearInformations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'FeePoliceId', 'Schedule', 'PaymentFormId', 'SchoolDay',
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function paymentForm()
    {
        return $this->belongsTo(\GGPHP\Fee\Models\PaymentForm::class, 'PaymentFormId');
    }
}
