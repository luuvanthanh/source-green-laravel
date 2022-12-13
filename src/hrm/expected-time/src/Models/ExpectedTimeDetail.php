<?php

namespace GGPHP\ExpectedTime\Models;

use GGPHP\Arkki\Models\TeachingShift;
use GGPHP\Core\Models\UuidModel;

class ExpectedTimeDetail extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ExpectedTimeDetails';

    const WEEK = [
        'MONDAY' => 1,
        'TUESDAY' => 2,
        'WEDNESDAY' => 3,
        'THURSDAY' => 4,
        'FRIDAY' => 5,
        'SATURDAY' => 6,
        'SUNDAY' => 7
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['Type', 'Time', 'TeachingShiftId', 'IsActive', 'ExpectedTimeId'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function teachingShift()
    {
        return $this->belongsTo(TeachingShift::class, 'TeachingShiftId');
    }
}
