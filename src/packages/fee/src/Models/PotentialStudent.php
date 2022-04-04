<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class PotentialStudent extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.PotentialStudents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'NameStudent', 'DateOfBirth', 'Age', 'DayAdmission',
        'FatherName', 'FatherPhoneNumber', 'MotherName', 'MotherPhoneNumber', 'TotalMoney',
    ];
}
