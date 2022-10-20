<?php

namespace GGPHP\BusinessCard\Models;

use GGPHP\Core\Models\UuidModel;

class BusinessCard extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'BusinessCards';

    const STATUS = [
        'WAITING_APPROVAL' => 1,
        'APPROVED' => 2,
        'NOT_APPROVED' => 3
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'AbsentTypeId', 'StartDate', 'EndDate', 'Reason', 'Status', 'ReasonNotApproved'
    ];

    protected $dateTimeFields = [
        'Date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'Date' => 'datetime',
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function businessCardDetail()
    {
        return $this->hasMany(\GGPHP\BusinessCard\Models\BusinessCardDetail::class, 'BusinessCardId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function absentType()
    {
        return $this->belongsTo(\GGPHP\Absent\Models\AbsentType::class, 'AbsentTypeId');
    }

    public function approvalEmployee()
    {
        return $this->hasMany(ApprovalEmployee::class, 'BusinessCardId');
    }
}
