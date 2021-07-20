<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class ChangeParameter extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.ChangeParameters';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'SchoolYearId', 'PaymentFormId', 'DuaDate',
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
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function changeParameterDetail()
    {
        return $this->hasMany(ChangeParameterDetail::class, 'ChangeParameterId');
    }
}
