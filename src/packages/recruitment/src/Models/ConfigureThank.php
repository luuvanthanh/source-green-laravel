<?php

namespace GGPHP\Recruitment\Models;

use GGPHP\Core\Models\UuidModel;

class ConfigureThank extends UuidModel
{
    public $incrementing = false;


    /**
     * Declare the table name
     */
    protected $table = 'ConfigureThanks';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Content',
    ];
}
