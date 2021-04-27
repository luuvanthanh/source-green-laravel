<?php

namespace GGPHP\Clover\Models;

use GGPHP\Core\Models\UuidModel;

class ClassStudent extends UuidModel
{
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
        'ClassId', 'StudentId', 'JoinDate', 'Description', 'CreatorId',
    ];

    public function classes()
    {
        return $this->belongsTo(\GGPHP\Clover\Models\Classes::class, 'ClassId');
    }
}
