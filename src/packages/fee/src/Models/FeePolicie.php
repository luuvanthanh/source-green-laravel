<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class FeePolicie extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.FeePolicies';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'SchoolYearId', 'DecisionNumber', 'DecisionDate',
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function schoolYearInformation()
    {
        return $this->hasMany(\GGPHP\Fee\Models\SchoolYearInformation::class, 'FeePoliceId');
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function feeDetail()
    {
        return $this->hasMany(\GGPHP\Fee\Models\FeeDetail::class, 'FeePoliceId');
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function moneyMeal()
    {
        return $this->hasMany(\GGPHP\Fee\Models\MoneyMeal::class, 'FeePoliceId');
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function otherMoneyDetail()
    {
        return $this->hasMany(\GGPHP\Fee\Models\OtherMoneyDetail::class, 'FeePoliceId');
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function schoolYear()
    {
        return $this->belongsTo(\GGPHP\Fee\Models\SchoolYear::class, 'SchoolYearId');
    }
}
