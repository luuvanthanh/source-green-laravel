<?php

namespace GGPHP\Crm\Clover\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;

class ParentAccount extends UuidModel
{
    protected $table = 'object.ParentAccounts';

    protected $fillable = [
        'ParentId',
        'AppUserId',
        'UserName',
        'FaceImageStatus'
    ];
}
