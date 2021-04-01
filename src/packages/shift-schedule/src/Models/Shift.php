<?php

namespace GGPHP\ShiftSchedule\Models;

use GGPHP\Core\Models\UuidModel;

class Shift extends UuidModel
{
    public $incrementing = false;

    const ON = 'ON';
    const OFF = 'OFF';

    /**
     * Declare the table name
     */
    protected $table = 'shifts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'shift_code', 'description', 'status',
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
        return $this->hasMany(\GGPHP\ShiftSchedule\Models\ShiftDetail::class);
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
                'start_time' => $item['start_time'],
                'end_time' => $item['end_time'],
            ];
        });

        return json_encode($shiftDetail);
    }
}
