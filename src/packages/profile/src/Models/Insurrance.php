<?php

namespace GGPHP\Profile\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class Insurrance extends UuidModel
{
    public $incrementing = false;

    protected $table = 'Insurrances';

    protected $fillable = [
        'EmployeeId', 'InsurranceNumber', 'TimeJoin', 'TimeStart',
    ];

    protected $dateTimeFields = [
        'TimeJoin',
        'TimeStart',
    ];

    protected $casts = [
        'TimeJoin' => 'datetime',
        'TimeStart' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }

}
