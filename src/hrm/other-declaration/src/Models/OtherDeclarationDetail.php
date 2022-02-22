<?php

namespace GGPHP\OtherDeclaration\Models;

use GGPHP\Core\Models\UuidModel;

class OtherDeclarationDetail extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'OtherDeclarationDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'OtherDeclarationId', 'EmployeeId', 'Detail',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }
}
