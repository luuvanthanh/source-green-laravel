<?php

namespace GGPHP\InOutHistories\Models;

use GGPHP\Core\Models\UuidModel;

class InOutHistories extends UuidModel
{
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
        'StudentId', 'AttendedAt', 'FileImage',
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

}
