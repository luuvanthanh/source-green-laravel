<?php

namespace  GGPHP\ApiShare\Models;

use GGPHP\Core\Models\UuidModel;

class AccessApi extends UuidModel
{
    protected $table = 'access_apis';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['api_share_id', 'time', 'status', 'response'];

    protected $casts = [
        'is_share' => 'boolean',
    ];
}
