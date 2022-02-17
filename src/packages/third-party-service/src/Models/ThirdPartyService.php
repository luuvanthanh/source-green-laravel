<?php

namespace  GGPHP\ThirdPartyService\Models;

use GGPHP\Core\Models\UuidModel;

class ThirdPartyService extends UuidModel
{
    protected $table = 'third_party_services';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'code', 'value'];
}
