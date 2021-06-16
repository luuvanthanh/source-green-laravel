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
        'YearFrom', 'YearTo', 'StartDate', 'EndDate',
    ];

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
        return $this->hasMany(ChangeParameter::class, 'SchoolYearId');
    }
}
