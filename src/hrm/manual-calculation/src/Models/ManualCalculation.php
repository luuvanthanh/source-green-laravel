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
        'X' => 1,  //working
        'K' => 2,  //leave work without permission
        'F' => 3,  //leave work with permission
        'N' => 4   //define to delete records
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
