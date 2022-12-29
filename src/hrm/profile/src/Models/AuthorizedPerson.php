<?php

namespace GGPHP\Profile\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class AuthorizedPerson extends UuidModel
{
    public $incrementing = false;

    protected $table = 'AuthorizedPersons';

    protected $fillable = [
        'EmployeeId', 'DateApply', 'IsEffect', 'PowerOfAttorney'
    ];

    protected $casts = [
        'IsEffect' => 'boolean'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(User::class, 'EmployeeId');
    }
}
