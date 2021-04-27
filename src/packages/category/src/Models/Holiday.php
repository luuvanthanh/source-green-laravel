<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class Holiday extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'Holidays';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
    ];

    /**
     * Define relations schedule exception
     */
    public function holidayDetail()
    {
        return $this->hasMany(\GGPHP\Category\Models\HolidayDetail::class, 'HolidayId');
    }
}
