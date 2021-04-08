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

    protected $fillable = ['user_id'];

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
    public function user()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class);
    }

}
