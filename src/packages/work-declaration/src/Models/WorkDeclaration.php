<?php

namespace GGPHP\WorkDeclaration\Models;

use GGPHP\Core\Models\UuidModel;

class WorkDeclaration extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'work_declarations';

    protected $fillable = ['employee_id'];

    /**
     * Define relations workDeclarationDetails
     */
    public function workDeclarationDetails()
    {
        return $this->hasMany(\GGPHP\WorkDeclaration\Models\WorkDeclarationDetail::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class);
    }

}
