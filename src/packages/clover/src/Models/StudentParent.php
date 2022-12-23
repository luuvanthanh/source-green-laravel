<?php

namespace GGPHP\Clover\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class StudentParent extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    // public $timestamps = false;

    /**
     * Declare the table name
     */
    protected $table = 'object.StudentParents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'StudentId', 'ParentId', 'RelationType',
    ];
}
