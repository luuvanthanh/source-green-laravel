<?php

namespace GGPHP\ActivityLog\Models;

use GGPHP\Core\Models\CoreModel;
use Spatie\Activitylog\Models\Activity;

class ActivityLog extends Activity
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'log_name', 'description', 'subject_id', 'subject_type', 'causer_id', 'causer_type', 'properties'
    ];

}
