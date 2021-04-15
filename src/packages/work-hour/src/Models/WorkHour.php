<?php

namespace GGPHP\WorkHour\Models;

use GGPHP\Core\Models\UuidModel;

class WorkHour extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'work_hours';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'employee_id', 'date', 'hours', 'reason',
    ];

    protected $dateTimeFields = [
        'date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'date' => 'datetime',
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class);
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employeeCreate()
    {
        return $this->belongsTo(User::class, 'employee_create');
    }

    /**
     * Define relations Store
     */
    public function store()
    {
        return $this->belongsTo(\GGPHP\RolePermission\Models\Store::class);
    }

}
