<?php

namespace GGPHP\Clover\Models;

use GGPHP\Core\Models\UuidModel;

class ParentAccount extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'object.ParentAccounts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ParentId', 'AppUserId', 'UserName', 'CreatorId', 'FaceImageStatus',
    ];

}
