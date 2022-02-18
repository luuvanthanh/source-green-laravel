<?php

namespace  GGPHP\NasConfig\Models;

use GGPHP\Core\Models\UuidModel;

class NasConfig extends UuidModel
{
    protected $table = 'nas_configs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['ip', 'username', 'password', 'folder'];
}
