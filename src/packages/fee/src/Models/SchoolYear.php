<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class SchoolYear extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.SchoolYears';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'YearFrom', 'YearTo', 'StartDate', 'EndDate', 'TotalMonth', 'SchoolYearCrmId'
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
    protected $casts = [];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function fixedParameter()
    {
        return $this->hasMany(FixedParameter::class, 'SchoolYearId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function changeParameter()
    {
        return $this->hasOne(ChangeParameter::class, 'SchoolYearId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function timetable()
    {
        return $this->hasMany(Timetable::class, 'SchoolYearId');
    }
}
