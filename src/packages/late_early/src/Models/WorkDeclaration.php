<?php

namespace GGPHP\LateEarly\Models;

use GGPHP\Core\Models\CoreModel;
use GGPHP\LateEarly\Presenters\WorkDeclarationPresenter;
use GGPHP\RolePermission\Models\Store;
use GGPHP\Users\Models\User;

class WorkDeclaration extends CoreModel
{

    protected $presenter = WorkDeclarationPresenter::class;

    /**
     * Declare the table name
     */
    protected $table = 'work_declarations';

    protected $fillable = ['user_id', 'store_id'];

    /**
     * Define relations workDeclarationDetails
     */
    public function workDeclarationDetails()
    {
        return $this->hasMany(\GGPHP\LateEarly\Models\WorkDeclarationDetail::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
