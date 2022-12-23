<?php

namespace GGPHP\BusinessCard\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class ApprovalEmployee extends UuidModel
{
    //use ActivityLogTrait;
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

    public function employee()
    {
        return $this->belongsTo(User::class, 'EmployeeId');
    }
}
