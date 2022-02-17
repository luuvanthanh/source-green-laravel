<?php

namespace GGPHP\Crm\SsoAccount\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class SsoAccount extends UuidModel
{
    use SoftDeletes;

    protected $table = 'sso_accounts';

    protected $fillable = [
        'model_type', 'model_id', 'sso_user_id', 'user_name', 'full_name', 'phone_number', 'email'
    ];

    /**
     * Define relations object
     */
    public function objectTable()
    {
        return $this->morphTo();
    }
}
