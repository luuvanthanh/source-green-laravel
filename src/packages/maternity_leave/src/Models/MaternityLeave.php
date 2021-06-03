<?php

namespace GGPHP\MaternityLeave\Models;

use GGPHP\Core\Models\UuidModel;

class MaternityLeave extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'MaternityLeaves';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'StartDate', 'EndDate',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'StartDate' => 'date:Y-m-d',
        'EndDate' => 'date:Y-m-d',
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }

}
