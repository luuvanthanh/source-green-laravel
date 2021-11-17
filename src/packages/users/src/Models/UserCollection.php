<?php

namespace GGPHP\Users\Models;

use GGPHP\Core\Models\CoreModel;
use GGPHP\Users\Models\User;
use GGPHP\Collection\Models\Collection;

class UserCollection extends CoreModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'user_id', 'collection_id', 'created_at', 'updated_at'
    ];

    protected $guard_name = 'api';

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateTimeFormat = 'c';

    /**
     * Collection belong to
     *
     * @return type
     */
    public function collection() {
        return $this->belongsTo(Collection::class);
    }

    /**
     * User belong to
     *
     * @return type
     */
    public function user() {
        return $this->belongsTo(User::class);
    }
}
