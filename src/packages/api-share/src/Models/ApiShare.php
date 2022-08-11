<?php

namespace  GGPHP\ApiShare\Models;

use GGPHP\Core\Models\UuidModel;

class ApiShare extends UuidModel
{
    protected $table = 'api_shares';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'link', 'is_share', 'name_route'];

    protected $casts = [
        'is_share' => 'boolean',
    ];

    public function accessApi()
    {
        return $this->hasMany(AccessApi::class);
    }
}
