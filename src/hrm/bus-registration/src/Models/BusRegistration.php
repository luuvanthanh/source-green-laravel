<?php

namespace GGPHP\BusRegistration\Models;

use GGPHP\BusRegistration\Models\BusRegistrationDetail;
use GGPHP\Core\Models\UuidModel;

class BusRegistration extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'BusRegistrations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'Date', 'StartDate', 'EndDate', 'HourNumber', 'Note',
    ];

    protected $dateTimeFields = [
        'Date',
        'StartDate',
        'EndDate',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'Date' => 'datetime',
        'StartDate' => 'datetime',
        'EndDate' => 'datetime',
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
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function busRegistrationDetail()
    {
        return $this->hasMany(BusRegistrationDetail::class, 'BusRegistrationId');
    }
}
