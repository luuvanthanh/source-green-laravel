<?php

namespace GGPHP\WorkOnline\Models;

use GGPHP\Core\Models\UuidModel;

class WorkOnline extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'WorkOnlines';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'StartDate', 'EndDate', 'AbsentTypeId', 'EmployeeId', 'Reason'
    ];

    /**
     * Define relations user
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }

    public function absentType()
    {
        return $this->belongsTo(\GGPHP\Absent\Models\AbsentType::class, 'AbsentTypeId');
    }

    public function workOnlineDetail()
    {
        return $this->hasMany(WorkOnlineDetail::class, 'WorkOnlineId');
    }
}
