<?php

namespace GGPHP\Fee\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Clover\Models\Classes;
use GGPHP\Core\Models\UuidModel;

class ClassType extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.ClassTypes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Name', 'Code', 'From', 'To', 'Description', 'ClassTypeCrmId',
    ];

    public function classes()
    {
        return $this->hasMany(Classes::class, 'ClassTypeId');
    }

    public function chargeOldStudent()
    {
        return $this->hasMany(ChargeOldStudent::class, 'ClassTypeId');
    }
}
