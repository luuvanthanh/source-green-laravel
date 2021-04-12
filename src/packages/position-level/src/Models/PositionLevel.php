<?php

namespace GGPHP\PositionLevel\Models;

use GGPHP\Core\Models\UuidModel;

class PositionLevel extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'position_levels';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'employee_id', 'branch_id', 'position_id', 'division_id',
        'start_date', 'end_date', 'type',
    ];

    protected $dateTimeFields = [
        'start_date',
        'end_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'employee_id');
    }

    /**
     * Define relations position
     */
    public function branch()
    {
        return $this->hasOne(\GGPHP\Category\Models\Branch::class, 'id', 'branch_id');
    }

    /**
     * Define relations position
     */
    public function position()
    {
        return $this->hasOne(\GGPHP\Category\Models\Position::class, 'id', 'position_id');
    }

    /**
     * Define relations division
     */
    public function division()
    {
        return $this->hasOne(\GGPHP\Category\Models\Division::class, 'id', 'division_id');
    }
}
