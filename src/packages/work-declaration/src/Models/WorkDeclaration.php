<?php

namespace GGPHP\WorkDeclaration\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class WorkDeclaration extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'WorkDeclarations';

    protected $fillable = ['EmployeeId', 'Date', 'Time', 'Reason'];

    protected $dateTimeFields = [
        'Date',
    ];

    protected $casts = [
        'Date' => 'datetime',
    ];

    /**
     * Define relations workDeclarationDetails
     */
    public function workDeclarationDetails()
    {
        return $this->hasMany(\GGPHP\WorkDeclaration\Models\WorkDeclarationDetail::class, 'WorkDeclarationId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }
}
