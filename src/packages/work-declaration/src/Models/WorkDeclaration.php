<?php

namespace GGPHP\WorkDeclaration\Models;

use GGPHP\Core\Models\UuidModel;

class WorkDeclaration extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'WorkDeclarations';

    protected $fillable = ['EmployeeId', 'Date', 'Time'];

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
