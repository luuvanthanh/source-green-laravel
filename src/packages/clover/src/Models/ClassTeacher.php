<?php

namespace GGPHP\Clover\Models;

use GGPHP\Core\Models\UuidModel;

class ClassTeacher extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'distribution.ClassTeachers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ClassId', 'EmployeeId', 'StartDate', 'Description', 'CreatorId',
    ];

    public function classes()
    {
        return $this->belongsTo(\GGPHP\Clover\Models\Classes::class, 'ClassId');
    }

    public function teacher()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }
}
