<?php

namespace GGPHP\InOutHistories\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\SchoolYear;

class InOutHistories extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'InOutHistories';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'StudentId', 'AttendedAt', 'FileImage', 'SchoolYearId'
    ];

    protected $dateTimeFields = [
        'AttendedAt',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'AttendedAt' => 'datetime',
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function student()
    {
        return $this->belongsTo(\GGPHP\Clover\Models\Student::class, 'StudentId');
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class, 'SchoolYearId');
    }
}
