<?php

namespace GGPHP\BusinessCard\Models;

use GGPHP\Core\Models\UuidModel;

class ApprovalEmployee extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ApprovalEmployees';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'BusinessCardId'
    ];
}
