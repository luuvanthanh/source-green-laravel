<?php

namespace GGPHP\AddSubTime\Models;

use GGPHP\Core\Models\UuidModel;

class AddSubTime extends UuidModel
{
    public $incrementing = false;

    protected $table = 'add_sub_times';

    /**
     * Status AddSubTime
     */
    const ADD = 'ADD';
    const SUB = 'SUB';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'type',
    ];

    /**
     * Define relations store
     */
    public function addSubTimeDetail()
    {
        return $this->hasMany(\GGPHP\AddSubTime\Models\AddSubTimeDetail::class);
    }

    /**
     * Define relations store
     */
    public function user()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'user_id');
    }
}
