<?php

namespace  GGPHP\AiService\Models;

use GGPHP\Core\Models\UuidModel;

class AiService extends UuidModel
{
    protected $table = 'ai_services';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [];
}
