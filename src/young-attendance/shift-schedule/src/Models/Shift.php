<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class Shift extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    const ON = 'ON';
    const OFF = 'OFF';

    /**
     * Declare the table name
     */
    protected $table = 'ShiftStudents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ShiftCode', 'Description', 'Status', 'BranchId',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Define relations shiftDetail
     */
    public function shiftDetail()
    {
        return $this->hasMany(\GGPHP\YoungAttendance\ShiftSchedule\Models\ShiftDetail::class, 'ShiftId');
    }

    /**
     * Define relations employee
     */
    public function branch()
    {
        return $this->belongsTo(\GGPHP\Category\Models\Branch::class, 'BranchId');
    }

    /**
     * Get shiftDetail To Json
     *
     * @return string
     */
    public function shiftDetailToJson()
    {
        $shiftDetail = $this->shiftDetail->map(function ($item, $key) {
            return [
                'StartTime' => $item['StartTime'],
                'EndTime' => $item['EndTime'],
            ];
        });

        return json_encode($shiftDetail);
    }
}
