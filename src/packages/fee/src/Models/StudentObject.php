<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class StudentObject extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.StudentObjects';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'Description', 'IsGrateful',
    ];
}
