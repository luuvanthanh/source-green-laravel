<?php

namespace GGPHP\ExpectedTime\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class ExpectedTime extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ExpectedTimes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'StartDate', 'EndDate', 'EmployeeId'
    ];

    protected $dateTimeFields = [];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function employee()
    {
        return $this->belongsTo(User::class, 'EmployeeId');
    }

    public function expectedTimeDetail()
    {
        return $this->hasMany(ExpectedTimeDetail::class, 'ExpectedTimeId');
    }
}
