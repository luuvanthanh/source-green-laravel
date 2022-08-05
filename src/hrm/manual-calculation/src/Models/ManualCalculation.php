<?php

namespace GGPHP\ManualCalculation\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class ManualCalculation extends UuidModel
{
    use SoftDeletes;

    /**
     * Declare the table name
     */
    protected $table = 'ManualCalculations';

    const TYPE = [
        'X' => 1,  //Working
        'K' => 2,  //Leave work without permission
        'F' => 3,  //Leave work with permission
        'N' => 4,   //Define to delete records
        'X/2' => 5,  //working half day and half day leave
        'K/2' => 6, //Working half a day, day off without leave
        'F/2' => 7  //Half day leave, half-day unpaid leave
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'Type', 'Date'
    ];

    /**
     * Define relations employee
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }
}
