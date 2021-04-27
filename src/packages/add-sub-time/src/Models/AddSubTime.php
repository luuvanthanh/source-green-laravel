<?php

namespace GGPHP\AddSubTime\Models;

use GGPHP\Core\Models\UuidModel;

class AddSubTime extends UuidModel
{
    public $incrementing = false;

    protected $table = 'AddSubTimes';

    /**
     * Status AddSubTime
     */
    const ADD = 'ADD';
    const SUB = 'SUB';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'Type',
    ];

    /**
     * Define relations store
     */
    public function addSubTimeDetail()
    {
        return $this->hasMany(\GGPHP\AddSubTime\Models\AddSubTimeDetail::class, 'AddSubTimeId');
    }

    /**
     * Define relations store
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }
}
