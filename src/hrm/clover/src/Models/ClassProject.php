<?php

namespace GGPHP\Clover\Models;

use GGPHP\Core\Models\UuidModel;

class ClassProject extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'distribution.ClassProjects';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ClassId',
        'ItemId',
        'ItemName',
        'OrderIndex',
        'OrderIndexParent',
        'CreatorId',
        'Duration',
        'ParentId',
        'Skill',
        'Target',
        'Topic',
        'Type',
        'IsSchedule',
    ];
   
}
