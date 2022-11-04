<?php

namespace GGPHP\Clover\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class StudentTransporter extends UuidModel
{
    use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'object.StudentTransporters';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'StudentId','FullName','IdentifyNumber','Phone','FileImage','Relationship'
    ];
}
