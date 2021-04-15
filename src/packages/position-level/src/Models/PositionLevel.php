<?php

namespace GGPHP\PositionLevel\Models;

use GGPHP\Core\Models\UuidModel;

class PositionLevel extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'PositionLevels';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'BranchId', 'PositionId', 'DivisionId',
        'StartDate', 'EndDate', 'Type',
    ];

    protected $dateTimeFields = [
        'StartDate',
        'EndDate',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'StartDate' => 'datetime',
        'EndDate' => 'datetime',
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
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }

    /**
     * Define relations position
     */
    public function branch()
    {
        return $this->hasOne(\GGPHP\Category\Models\Branch::class, 'id', 'BranchId');
    }

    /**
     * Define relations position
     */
    public function position()
    {
        return $this->hasOne(\GGPHP\Category\Models\Position::class, 'id', 'PositionId');
    }

    /**
     * Define relations division
     */
    public function division()
    {
        return $this->hasOne(\GGPHP\Category\Models\Division::class, 'id', 'DivisionId');
    }
}
