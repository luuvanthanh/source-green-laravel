<?php

namespace GGPHP\ActivityLog\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\ChargeOldStudent;
use GGPHP\Refund\Models\RefundStudent;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActivityLog extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ActivityLogs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Description', 'SubjectId', 'SubjectType', 'CauserId', 'CauserType', 'Properties'
    ];
}
