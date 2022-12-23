<?php

namespace GGPHP\Category\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class Holiday extends UuidModel
{
    //use ActivityLogTrait;
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
        'Name',
    ];

    /**
     * Define relations schedule exception
     */
    public function holidayDetail()
    {
        return $this->hasMany(\GGPHP\Category\Models\HolidayDetail::class, 'HolidayId');
    }
}
