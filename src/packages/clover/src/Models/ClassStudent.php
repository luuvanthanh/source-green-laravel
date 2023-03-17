<?php

namespace GGPHP\Clover\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\SchoolYear;

class ClassStudent extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'distribution.ClassStudents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ClassId', 'StudentId', 'JoinDate', 'Description', 'CreatorId', 'SchoolYearId', 'IsLastest'
    ];

    public function classes()
    {
        return $this->belongsTo(\GGPHP\Clover\Models\Classes::class, 'ClassId');
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class, 'SchoolYearId');
    }
}
