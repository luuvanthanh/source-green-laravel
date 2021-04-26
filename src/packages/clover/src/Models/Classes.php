<?php

namespace GGPHP\Clover\Models;

use GGPHP\Core\Models\UuidModel;

class Classes extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'origination.Classes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'Year', 'BranchId', 'Description', 'ExtraProperties', 'ConcurrencyStamp',
        'CreatorId', 'LastModifierId', 'IsDeleted', 'DeleterId', 'DeletionTime',
    ];
}
