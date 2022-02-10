<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class ClassType extends UuidModel
{
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
}
