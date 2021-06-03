<?php

namespace GGPHP\Clover\Models;

use GGPHP\Core\Models\UuidModel;

class EmployeeAccount extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'object.EmployeeAccounts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'AppUserId', 'UserName', 'CreatorId', 'FaceImageStatus',
    ];

}
