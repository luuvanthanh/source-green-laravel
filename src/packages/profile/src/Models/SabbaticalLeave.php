<?php

namespace GGPHP\Profile\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class SabbaticalLeave extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    protected $table = 'SabbaticalLeaves';

    protected $fillable = [
        'EmployeeId', 'AnnualLeave', 'Year',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }
}
