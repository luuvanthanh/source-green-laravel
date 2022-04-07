<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class ChargeOldStudent extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.ChargeOldStudents';

    const PAYMENT_STATUS = [
        'UNPAID' => 1,
        'PAYING' => 2,
        'PAID' => 3
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'StudentId', 'SchoolYearId',  'TotalMoney', 'DayAdmission', 'ExpectedToCollectMoney', 'PaymentStatus', 'ChargeStudentIdCrm'
    ];

    protected $casts = [
        'ExpectedToCollectMoney' => 'array'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tuition()
    {
        return $this->hasMany(OldStudentTuition::class, 'ChargeOldStudentId');
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function schoolYear()
    {
        return $this->belongsTo(\GGPHP\Fee\Models\SchoolYear::class, 'SchoolYearId');
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function student()
    {
        return $this->belongsTo(\GGPHP\Clover\Models\Student::class, 'StudentId');
    }

    public function detailPaymentAccountant()
    {
        return $this->hasMany(DetailPaymentAccountant::class, 'ChargeOldStudentId');
    }
}
