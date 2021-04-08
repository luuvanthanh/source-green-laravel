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
        'user_id', 'date', 'hours', 'reason',
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
    public function user()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class);
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function userCreate()
    {
        return $this->belongsTo(User::class, 'user_create');
    }

    /**
     * Define relations Store
     */
    public function store()
    {
        return $this->belongsTo(\GGPHP\RolePermission\Models\Store::class);
    }

}
