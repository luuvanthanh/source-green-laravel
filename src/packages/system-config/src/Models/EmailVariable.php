<?php

namespace  GGPHP\SystemConfig\Models;

use GGPHP\Core\Models\UuidModel;

class EmailVariable extends UuidModel
{
    protected $table = 'email_variable_definitions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['code', 'name', 'description'];


    protected $casts = [];
}
