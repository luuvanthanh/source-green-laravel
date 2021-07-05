<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class ChargeStudent extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.ChargeStudents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'NameStudent', 'SchoolYearId', 'DateOfBirth', 'Age', 'DayAdmission', 'ClassTypeId',
        'FatherName', 'FatherPhoneNumber', 'MotherName', 'MotherPhoneNumber', 'TotalMoney',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tuition()
    {
        return $this->hasMany(Tuition::class, 'ChargeStudentId');
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
